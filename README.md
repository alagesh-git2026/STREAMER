# STREAMER Portfolio — Lab of Future (LOF)

Internal Analytics & Talent Intelligence Dashboard for **Lab of Future (LOF)** K-12 experiential STEM & STEAM innovation labs operating across **Bengaluru, New Delhi, Dubai, Austin, and Shanghai**.

Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Recharts**.

---

## 🚀 Live Deployment via GitHub Actions

This repository is configured with an automated continuous deployment workflow using GitHub Actions (`.github/workflows/deploy.yml`) to publish the application to **GitHub Pages**.

### One-Time Setup in GitHub Repository Settings

To activate deployment on your repository:

1. Go to your GitHub repository: [`https://github.com/alagesh-git2026/STREAMER`](https://github.com/alagesh-git2026/STREAMER)
2. Click on **Settings** (tab at the top).
3. In the left navigation menu under **Code and automation**, click **Pages**.
4. Under **Build and deployment** > **Source**, change the dropdown from *Deploy from a branch* to **GitHub Actions**.
5. Push any commit to the `main` branch (or go to **Actions** > **Deploy to GitHub Pages** > **Run workflow**).
6. Once the workflow completes, your site will be live at:
   👉 **`https://alagesh-git2026.github.io/STREAMER/`**

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server with Hot Module Replacement
npm run dev

# Build production bundle with type checking
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack & Architecture

- **Build Engine:** Vite 6 with React 18 & TypeScript
- **Styling:** Tailwind CSS 3 with custom brand themes (`streamer-science`, `streamer-technology`, `streamer-engineering`, `streamer-math`)
- **Data Visualizations:** Recharts (Radar, Bar, Line charts)
- **Routing:** React Router (HashRouter for seamless GitHub Pages deep linking and zero-config refresh support)
- **Icons:** Lucide React
- **CI/CD:** GitHub Actions (`actions/deploy-pages@v4`, `actions/upload-pages-artifact@v3`, `actions/configure-pages@v5`)
