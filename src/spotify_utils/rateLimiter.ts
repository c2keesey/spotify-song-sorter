const queue: (() => Promise<any>)[] = [];
let isProcessing = false;

const RATE_LIMIT_DELAY = 100; // 100ms between requests
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    // Don't retry if we're out of retries
    if (retries <= 0) throw error;

    // Only retry on specific errors (429 Too Many Requests, 500s, 503 Service Unavailable)
    if (error instanceof Error) {
      const status = (error as any).status;
      if (status && ![429, 500, 503].includes(status)) {
        throw error;
      }
    }

    // Wait before retrying
    await sleep(delay);

    // Retry with exponential backoff
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
};

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  while (queue.length > 0) {
    const task = queue.shift();
    if (task) {
      await task();
      await sleep(RATE_LIMIT_DELAY);
    }
  }
  isProcessing = false;
};

export const enqueueRequest = async <T>(
  request: () => Promise<T>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    queue.push(async () => {
      try {
        const result = await retryWithBackoff(request);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
};
