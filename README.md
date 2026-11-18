# 🩺 PulsePoint - Campus Public Health Survey Platform

PulsePoint is a lightweight, modern, and anonymous public health survey platform designed for college students to track and visualize daily wellness indicators—including sleep hygiene, pre-bed screen habits, hydration, and academic stress.

Built with **pure HTML5, CSS3, and Vanilla JavaScript** with zero external dependencies.

---

## 🌟 Key Features

- **100% Anonymous Participation**: Zero Personally Identifiable Information (no names, roll numbers, or emails).
- **Personal Results Alone**: Instantly view your own submission results with tailored wellness advice right after submitting.
- **Dynamic CSS Bar Charts**: Real-time visualization of community health benchmarks calculated purely via CSS and JavaScript.
- **Client-Side Persistence**: Stores real submissions locally using browser `window.localStorage` (survives page refreshes).
- **Zero-Dependency Dev Server**: Includes `server.js` using Node.js built-in `http` module for instant `npm run dev`.

---

## 📁 Project Structure

```text
frontend/
├── index.html          # Landing page & survey introduction
├── survey.html         # 4-question survey form with live progress bar
├── dashboard.html      # Personal health profile & community analytics
├── about.html          # Project methodology & privacy statement
├── package.json        # Project metadata and dev scripts
├── server.js           # Lightweight local HTTP server (Zero dependencies)
├── css/
│   └── style.css       # Clean, modern design system
└── js/
    ├── survey.js       # Form validation & localStorage saving
    └── dashboard.js    # Statistics calculation & CSS bar chart rendering
```

---

## 🚀 How to Run Locally

### Option 1: Standard Development Server (Recommended)
Open your terminal in this folder and run:
```bash
npm run dev
```
Then visit `http://localhost:3000` in your browser.

*(If on Windows PowerShell, you can also run `npm.cmd run dev` or `node server.js`)*

### Option 2: Direct File Open
Simply double-click `index.html` to open it in Google Chrome, Microsoft Edge, or Firefox.

---

## 🛠️ Technology Stack
- **HTML5**: Semantic document structure
- **CSS3**: Modern Flexbox, CSS Grid, custom properties, and responsive media queries
- **Vanilla JavaScript (ES6+)**: Event listeners, DOM manipulation, JSON serialization, and `localStorage` API
- **Node.js (Optional)**: Built-in `http` server for local development

---

## 📄 License
This project is open-source and intended for academic and educational evaluation.
