# Jar of Us 🏺

A digital memory jar application. Shake your phone (or tap) to reveal a cherished memory once a day. Includes an admin interface for adding new memories and an AI-powered text enhancer.

## ✨ Features

- **Daily Lock**: Reveal only one memory every 24 hours.
- **Shake to Reveal**: Uses device motion sensors to detect shaking (works on mobile).
- **Admin Panel**: Secure interface to add memories and photos.
- **AI Enhancement**: Uses Google Gemini to rewrite memories poetically.
- **Offline Capable**: Uses LocalStorage to persist data.

---

## 🛠️ How to Set Up & Run Locally

To run this application on your computer or deploy it to GitHub, you need to set it up as a standard React project. We recommend using **Vite**.

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (Version 16 or higher).
- A code editor like VS Code.

### 2. Create the Project
Open your terminal/command prompt and run:

```bash
# 1. Create a new project
npm create vite@latest jar-of-us -- --template react-ts

# 2. Go into the folder
cd jar-of-us

# 3. Install dependencies
npm install lucide-react @google/genai firebase
```

### 3. Add Tailwind CSS
This app uses Tailwind CSS for styling.
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
*Update your `tailwind.config.js` content array:*
```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```
*Add to `src/index.css`:*
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Move Files
1.  **Source Code**: Move `App.tsx`, `index.tsx`, `types.ts`, and the `components/`, `services/` folders into the `src/` folder of your new project.
2.  **Public Assets**: Move `storage.json` into the `public/` folder.
3.  **Environment Variables**: Create a file named `.env` in the root folder and add your API key:
    ```
    VITE_API_KEY=your_google_gemini_key_here
    ```
    *(Note: You may need to update `services/gemini.ts` to use `import.meta.env.VITE_API_KEY` instead of `process.env.API_KEY` if using Vite)*.

### 5. Run It
```bash
npm run dev
```

---

## 🚀 How to Run on GitHub (GitHub Pages)

To share this with your partner, you can host it for free on GitHub Pages.

1.  **Create a Repo**: Go to GitHub.com and create a new repository named `jar-of-us`.
2.  **Prepare for Deployment**:
    In your `package.json`, add this line at the top level:
    ```json
    "homepage": "https://<YOUR_GITHUB_USERNAME>.github.io/jar-of-us",
    ```
    And add `gh-pages` to your scripts:
    ```bash
    npm install gh-pages --save-dev
    ```
    Update `scripts` in `package.json`:
    ```json
    "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist",
      ...
    }
    ```
3.  **Push & Deploy**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/<YOUR_USERNAME>/jar-of-us.git
    git push -u origin main
    
    # Deploy to live site
    npm run deploy
    ```
4.  **Finish**: Go to your repository **Settings > Pages**. Ensure the source is set to the `gh-pages` branch. Your site will be live at the link provided!

---

## 🔑 Configuration

### Passwords (Dates)
To change the login dates, edit `src/types.ts`:
- `DATE_GATE_USER`: The date to enter the Jar.
- `DATE_GATE_ADMIN`: The date to enter the Admin Panel.

### Images
- The app is designed to work with **Imgur** links.
- When adding a memory in the Admin panel, paste the Imgur link (e.g., `https://imgur.com/abc1234`). The app automatically converts it to a direct image link.
