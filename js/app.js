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

  // Stable sliding navigation indicator + scroll-aware active section.
  const navPills = Array.from(document.querySelectorAll('.nav-pill'));
  const navbar = document.querySelector('.glass-navbar, .glass-nav');
  let navIndicator = navbar?.querySelector('.nav-indicator');
  let activePill = null;
  let navFrame = 0;

  if (navbar && navPills.length) {
    if (!navIndicator) {
      navIndicator = document.createElement('span');
      navIndicator.className = 'nav-indicator';
      navIndicator.setAttribute('aria-hidden', 'true');
      navbar.appendChild(navIndicator);
    }

    const positionIndicator = (pill) => {
      if (!navbar || !navIndicator || !pill) return;
      const navRect = navbar.getBoundingClientRect();
      const pillRect = pill.getBoundingClientRect();
      navIndicator.style.width = pillRect.width + 'px';
      navIndicator.style.height = pillRect.height + 'px';
      navIndicator.style.transform =
        'translate3d(' + (pillRect.left - navRect.left) + 'px,' +
        (pillRect.top - navRect.top) + 'px,0)';
      navIndicator.classList.add('is-ready');
    };

    const setActiveNav = (pill) => {
      if (!pill || pill === activePill) return;
      activePill = pill;
      navPills.forEach(item => {
        const selected = item === pill;
        item.classList.toggle('active', selected);
        if (selected) item.setAttribute('aria-current', 'location');
        else item.removeAttribute('aria-current');
      });
      positionIndicator(pill);
    };

    navPills.forEach(pill => {
      pill.addEventListener('click', () => setActiveNav(pill));
    });

    const updateFromScroll = () => {
      navFrame = 0;
      const threshold = Math.max(120, (navbar?.getBoundingClientRect().bottom || 70) + 70);
      let currentSection = null;
      document.querySelectorAll('.section[id], .journey-section[id]').forEach(section => {
        if (section.getBoundingClientRect().top <= threshold) currentSection = section;
      });
      if (!currentSection) currentSection = document.querySelector('#hero');
      const match = navPills.find(pill => pill.getAttribute('href') === '#' + currentSection?.id);
      if (match) setActiveNav(match);
    };

    window.addEventListener('scroll', () => {
      if (!navFrame) navFrame = requestAnimationFrame(updateFromScroll);
    }, { passive: true });

    const realign = () => positionIndicator(activePill || navbar.querySelector('.nav-pill.active') || navPills[0]);
    window.addEventListener('resize', realign, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(realign);
    requestAnimationFrame(() => {
      setActiveNav(navbar.querySelector('.nav-pill.active') || navPills[0]);
      updateFromScroll();
    });
  }

  // Reveal content once as it enters view; avoid permanent scroll listeners.
  const revealTargets = document.querySelectorAll(
    '.journey-year,.skills-box,.project-card,.contact-card,.section-header,.journey-header'
  );
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(node => node.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    revealTargets.forEach((node, index) => {
      node.classList.add('reveal-on-scroll');
      node.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 65 + 'ms');
      revealObserver.observe(node);
    });
  }

  // Pointer position drives a restrained moving reflection on glass panels.
  const glassTargets = document.querySelectorAll('.glass-card,.skills-box,.project-card,.journey-card,.contact-card');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    glassTargets.forEach(panel => {
      panel.addEventListener('pointermove', event => {
        const rect = panel.getBoundingClientRect();
        panel.style.setProperty('--glass-x', ((event.clientX - rect.left) / rect.width * 100) + '%');
        panel.style.setProperty('--glass-y', ((event.clientY - rect.top) / rect.height * 100) + '%');
      }, { passive: true });
    });
  }
});
