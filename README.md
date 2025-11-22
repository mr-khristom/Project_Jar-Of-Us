
# Jar of Us 🏺

A digital memory jar application. Shake your phone (or tap) to reveal a cherished memory once a day.

## 🚨 FIXING THE "PINK SCREEN" ON GITHUB

If you see a blank pink screen on GitHub, it is because **you cannot just upload `.tsx` files to GitHub**. Browsers cannot read them. You must "Build" the app first.

### The 3-Step Deployment Process

**Step 1: Prepare your Local Computer**
1. Install [Node.js](https://nodejs.org/) if you haven't.
2. Download this project to a folder on your computer.
3. Open your terminal/command prompt in that folder.
4. Run `npm install` (this downloads the tools needed to build the app).

**Step 2: Set your API Key**
1. Create a file named `.env` in the root folder.
2. Add your key inside:
   ```
   VITE_API_KEY=your_actual_google_api_key_here
   ```

**Step 3: Build & Deploy**
1. In `package.json`, find the line `"homepage"` (it might not be there yet). **Add this line** at the top of the file:
   ```json
   "homepage": "https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>",
   ```
   *(Replace `<YOUR_GITHUB_USERNAME>` and `<REPO_NAME>` with your details)*.

2. Run this command in your terminal:
   ```bash
   npm run deploy
   ```

**That's it!** 
This command will:
1. Compile your TypeScript code into standard JavaScript.
2. Create a `dist` folder.
3. Automatically upload that `dist` folder to a `gh-pages` branch on your GitHub.
4. Your site will work in about 2 minutes.

---

## ✨ Features

- **Daily Lock**: Reveal only one memory every 24 hours.
- **Shake to Reveal**: Uses device motion sensors.
- **Admin Panel**: Secure interface to add memories.
- **AI Enhancement**: Uses Google Gemini to rewrite memories.

## 🔑 Passwords & Config

To change the login dates (passwords), edit `types.ts`:
- `DATE_GATE_USER`: The date to enter the Jar.
- `DATE_GATE_ADMIN`: The date to enter the Admin Panel.
