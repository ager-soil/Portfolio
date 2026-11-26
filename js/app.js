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
  const navbar = document.querySelector('.glass-navbar, .glass-nav');
  const navList = navbar?.querySelector('.nav-pills');
  let navIndicator = navbar?.querySelector('.nav-indicator');

  if (navbar && navList && !navIndicator) {
    navIndicator = document.createElement('span');
    navIndicator.className = 'nav-indicator';
    navIndicator.setAttribute('aria-hidden', 'true');
    navbar.appendChild(navIndicator);
  }

  const moveNavIndicator = (activePill) => {
    if (!navbar || !navIndicator || !activePill) return;
    const navRect = navbar.getBoundingClientRect();
    const pillRect = activePill.getBoundingClientRect();
    navIndicator.style.width = `${pillRect.width}px`;
    navIndicator.style.height = `${pillRect.height}px`;
    navIndicator.style.transform = `translate3d(${pillRect.left - navRect.left}px, ${pillRect.top - navRect.top}px, 0)`;
    navIndicator.classList.add('is-ready');
  };

  const setActiveNav = (activePill) => {
    navPills.forEach(pill => {
      const isActive = pill === activePill;
      pill.classList.toggle('active', isActive);
      if (isActive) pill.setAttribute('aria-current', 'location');
      else pill.removeAttribute('aria-current');
    });
    moveNavIndicator(activePill);
  };

  navPills.forEach(pill => {
    pill.addEventListener('click', () => setActiveNav(pill));
  });

  window.addEventListener('resize', () => {
    moveNavIndicator(navbar?.querySelector('.nav-pill.active'));
  }, { passive: true });

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.getAttribute('id');
      }
    });

    const activePill = Array.from(navPills).find(pill => pill.getAttribute('href') === `#${current}`);
    if (activePill) setActiveNav(activePill);
  }, { passive: true });

  // Position the selector after fonts/layout settle and keep it aligned on resize.
  requestAnimationFrame(() => moveNavIndicator(navbar?.querySelector('.nav-pill.active')));
});