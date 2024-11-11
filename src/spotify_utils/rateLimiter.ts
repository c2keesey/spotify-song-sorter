const queue: (() => Promise<any>)[] = [];
let isProcessing = false;

const RATE_LIMIT_DELAY = 200; // Increased to 200ms between requests
const MAX_RETRIES = 5; // Increased retries
const INITIAL_RETRY_DELAY = 2000; // Increased to 2 seconds
const MAX_CONCURRENT_REQUESTS = 3; // New: limit concurrent requests

let activeRequests = 0;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;

    if (error instanceof Error) {
      const status = (error as any).status;

      if (status === 429) {
        const retryAfter =
          parseInt((error as any).headers?.["retry-after"]) || delay;
        await sleep(retryAfter * 1000); // Retry-After is in seconds
        return retryWithBackoff(fn, retries - 1, delay * 2);
      }

      if (status && ![500, 503].includes(status)) {
        throw error;
      }
    }

    await sleep(delay);
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
};

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  while (queue.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS) {
    const task = queue.shift();
    if (task) {
      activeRequests++;
      try {
        await task();
      } finally {
        activeRequests--;
        await sleep(RATE_LIMIT_DELAY);
      }
    }
  }
  isProcessing = false;

  if (queue.length > 0) {
    processQueue();
  }
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
