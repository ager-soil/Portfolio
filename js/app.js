// General UI Logic, Project Dynamic Rendering, Active Nav Highlight & Loader
document.addEventListener('DOMContentLoaded', () => {
  
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
            <a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
            <a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Code</a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  };

  renderProjects();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.getAttribute('data-filter'));
    });
  });

  // Include the Journey timeline in scroll-aware navigation.
  const sections = document.querySelectorAll('.section, .journey-section');
  const navPills = document.querySelectorAll('.nav-pill');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
});