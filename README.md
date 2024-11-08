# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

# Spotify Song Sorter

A minimal web application for efficiently sorting your Spotify library. Built for keyboard-first navigation with a clean, modern UI using shadcn.

## Features

- Web-based Spotify player with keyboard controls
- Quick playlist management
- Song metadata (BPM, Genre, Artist)
- Minimal, dark-themed interface
- Modern UI components with shadcn

## Controls

```
SPACE   - Play/Pause
→       - Skip forward 5s
←       - Skip backward 5s
N       - Next song
/       - Focus playlist search
ENTER   - Add to selected playlist
ESC     - Clear search
```

## Development

1. Clone repository
2. Install dependencies:

```bash
npm install
```

3. Initialize shadcn:

```bash
npx shadcn-ui@latest init
```

4. Create `.env` file:

```
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
VITE_REDIRECT_URI=http://localhost:5173/callback
```

5. Start development server:

```bash
npm run dev
```

## Tech Stack

- Vite + React
- shadcn/ui
- Tailwind CSS
- Spotify Web Playback SDK
- Spotify Web API

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── Player.jsx
│   │   ├── PlaylistSearch.jsx
│   │   └── SongInfo.jsx
│   ├── utils/
│   │   ├── spotify.js
│   │   └── shortcuts.js
│   ├── styles/
│   │   └── globals.css   # Tailwind imports
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── components.json       # shadcn config
├── vite.config.js
└── package.json
```

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "spotify-web-api-node": "^5.0.2",
    "@radix-ui/react-icons": "^1.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0"
  }
}
```

## UI Components Used

- Dialog (for playlist search)
- Slider (for progress bar)
- Button
- Input
- Card
- Command (for keyboard shortcuts)

## Styling

Using shadcn's default dark theme with minimal customization:

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
};
```

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Deployment

Build the app:

```bash
npm run build
```

Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, GitHub Pages).

## License

MIT

Note: Requires a Spotify Premium account for playback features.
