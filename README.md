# Advanced Interactive Portfolio

An interactive, responsive, single-page developer portfolio designed for GitHub Pages. Built for an agriculture and technology developer studying **B. Sc. (Hons.) in Agriculture at Sister Nivedita University**, combining web development, geoinformatics, system simulation, baseline hydroponics, and smart climate agriculture research.

---

## 🌟 Key Features

* **3D Interactive Profile Card:** Hover and tilt perspective effect powered by CSS 3D transforms with specular dynamic lighting.
* **Three.js Particle Canvas:** High-performance WebGL animated background canvas responding dynamically to cursor movement.
* **GSAP Text Rotator:** Dynamic header switching between core domains and specializations.
* **Native Project Gallery:** Pure JavaScript data-driven dynamic layout (`projects-data.js`) with responsive category filtering.
* **Glassmorphism Theme:** Dark modern aesthetic with translucent panels and glowing CSS badges.
* **GitHub Pages Ready:** Zero build setup or compiler required; works out of the box using pure frontend static files.

---

## 🛠️ Technology Stack

| Component | Technology / Library |
| :--- | :--- |
| **Markup & Layout** | HTML5 (Semantic Structure) |
| **Styles** | CSS3 (Flexbox, CSS Grid, Glassmorphism, CSS Variables, 3D Transforms) |
| **Logic & Data** | Vanilla JavaScript (ES6+ Module Pattern) |
| **3D & Canvas** | [Three.js (r128 via CDN)](https://threejs.org/) |
| **Animations** | [GSAP (v3.12.2 via CDN)](https://greensock.com/gsap/) |
| **Icons & Fonts** | FontAwesome 6, Google Fonts (`Outfit`, `Inter`) |

---

## 📁 File Structure

```text
portfolio/
├── index.html               # Main application layout and semantic entry point
├── README.md                # Project documentation
├── css/
│   ├── main.css             # Global reset, dark theme variables, typography
│   ├── components.css       # Nav pills, glass cards, project buttons, badges
│   └── 3d-card.css          # CSS 3D card tilt & specular light glow
└── js/
    ├── app.js               # Dynamic card rendering, filter buttons, scroll highlight
    ├── 3d-card.js           # Three.js particle canvas & mouse tilt listener
    ├── dynamic-rotator.js   # GSAP dynamic role rotator logic
    └── projects-data.js     # Native JSON array for project items
```

---

## 🚀 How to Run Locally & Host on GitHub Pages

### Running Locally
1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/portfolio.git
   ```
2. Open `index.html` directly in any web browser, or launch using VS Code's **Live Server** extension.

### Hosting on GitHub Pages
1. Push your code to your GitHub repository.
2. Go to **Settings** > **Pages** in your repository.
3. Under **Build and deployment**, set the Branch to `main` (or `master`) and folder to `/ (root)`.
4. Click **Save**. Your site will be live within a couple of minutes!

---

## 📝 How to Add New Projects

Open `js/projects-data.js` and add a new object into the `projectsData` array:

```javascript
{
  id: 5,
  title: "Your Project Title",
  category: "geoinformatics", // Category key: "web", "geoinformatics", or "agri"
  tags: ["Geoinformatics", "Google Earth Engine"],
  description: "Brief summary of the project and technologies applied.",
  liveUrl: "https://your-live-demo-link.com",
  githubUrl: "https://github.com/your-username/project-repo"
}
```

---

## 📌 Planned Enhancements (Roadmap)

* [ ] Add dynamic animated text / custom rotating text preloader.
* [ ] Integrate Google Earth Engine raster dataset embeds into project showcases.
* [ ] Add interactive baseline hydroponics telemetry preview modal.
