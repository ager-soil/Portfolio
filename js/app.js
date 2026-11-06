// General UI Logic, Project Dynamic Rendering, Active Nav Highlight & Loader
document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Preloader Progress Simulation ---
  const preloader = document.getElementById('preloader');
  const loaderPercent = document.getElementById('loader-percent');
  
  if (preloader && loaderPercent) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        loaderPercent.textContent = `100%`;
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('fade-out');
        }, 300);
      } else {
        loaderPercent.textContent = `${progress}%`;
      }
    }, 100);
  }

  // --- 2. Dynamic Project Card Renderer ---
  const container = document.getElementById('projects-container');
  const filterBtns = document.querySelectorAll('.filter-btn');

  const renderProjects = (filter = 'all') => {
    if (!container || typeof projectsData === 'undefined') return;

    container.innerHTML = '';

    const filteredData = filter === 'all' 
      ? projectsData 
      : projectsData.filter(item => item.category === filter);

    filteredData.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      
      const tagsHtml = project.tags
        .map(tag => `<span class="project-tag">${tag}</span>`)
        .join('');

      card.innerHTML = `
        <div class="project-content">
          <div class="project-tags">${tagsHtml}</div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-links">
            <a href="${project.liveUrl}" class="project-link" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
            <a href="${project.githubUrl}" class="project-link" target="_blank"><i class="fa-brands fa-github"></i> Code</a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  };

  // Initial render
  renderProjects();

  // Filter Button Events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      renderProjects(filterValue);
    });
  });

  // --- 3. Active Nav Link Highlight on Scroll ---
  const sections = document.querySelectorAll('.section');
  const navPills = document.querySelectorAll('.nav-pill');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navPills.forEach(pill => {
      pill.classList.remove('active');
      if (pill.getAttribute('href') === `#${current}`) {
        pill.classList.add('active');
      }
    });
  });
});