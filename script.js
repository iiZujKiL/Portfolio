document.addEventListener('DOMContentLoaded', function () {

  // ===== NAVIGATION MOBILE =====
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
    document.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => navMenu.classList.remove('active')));
  }

  // ===== NAVBAR + LIEN ACTIF AU SCROLL =====
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
    let current = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 150) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // ===== INDICATEUR DE SCROLL =====
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () =>
      document.querySelector('#about').scrollIntoView({ behavior: 'smooth' }));
  }

  // ===== ANIMATIONS D'APPARITION =====
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.skill-card, .certification-card, .project-card, .timeline-item, .contact-item')
    .forEach(el => { el.classList.add('reveal'); observer.observe(el); });

  // ===== MODE SOMBRE =====
  const themeToggle = document.getElementById('theme-toggle');
  function setTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    const icon = themeToggle && themeToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-sun', theme === 'dark');
      icon.classList.toggle('fa-moon', theme !== 'dark');
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }
  if (themeToggle) {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved) setTheme(saved);
    themeToggle.addEventListener('click', () =>
      setTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark'));
  }

  // ===== VEILLE : DONNEES (à remplacer par tes vrais articles) =====
  const veilleData = [
    {
      period: "Septembre - Octobre 2025",
      articles: [
        { title: "Titre de l'article 1", source: "Source", date: "[date]", description: "Résumé en une ou deux phrases de l'article et de son intérêt pour ta veille.", link: "#" },
        { title: "Titre de l'article 2", source: "Source", date: "[date]", description: "Résumé en une ou deux phrases de l'article et de son intérêt pour ta veille.", link: "#" }
      ]
    },
    {
      period: "Novembre - Décembre 2025",
      articles: [
        { title: "Titre de l'article 3", source: "Source", date: "[date]", description: "Résumé en une ou deux phrases de l'article et de son intérêt pour ta veille.", link: "#" },
        { title: "Titre de l'article 4", source: "Source", date: "[date]", description: "Résumé en une ou deux phrases de l'article et de son intérêt pour ta veille.", link: "#" }
      ]
    },
    {
      period: "Janvier - Février 2026",
      articles: [
        { title: "Titre de l'article 5", source: "Source", date: "[date]", description: "Résumé en une ou deux phrases de l'article et de son intérêt pour ta veille.", link: "#" },
        { title: "Titre de l'article 6", source: "Source", date: "[date]", description: "Résumé en une ou deux phrases de l'article et de son intérêt pour ta veille.", link: "#" }
      ]
    }
  ];

  // ===== VEILLE : SLIDER =====
  (function initVeilleSlider() {
    const slider = document.getElementById('veille-slider');
    const indicators = document.getElementById('slider-indicators');
    const prev = document.querySelector('.prev-btn');
    const next = document.querySelector('.next-btn');
    if (!slider || !indicators) return;
    let current = 0;

    veilleData.forEach((data, i) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = `
        <div class="slide-header">
          <div class="slide-number">${i + 1}</div>
          <div class="slide-period">${data.period}</div>
        </div>
        <div class="articles-grid">
          ${data.articles.map(a => `
            <div class="article-card">
              <div class="article-meta">
                <span class="article-source">${a.source}</span>
                <span class="article-date">${a.date}</span>
              </div>
              <h4>${a.title}</h4>
              <p>${a.description}</p>
              <a href="${a.link}" class="article-link" target="_blank" rel="noopener noreferrer">
                Lire l'article <i class="fas fa-external-link-alt"></i>
              </a>
            </div>`).join('')}
        </div>`;
      slider.appendChild(slide);

      const dot = document.createElement('div');
      dot.className = 'indicator';
      dot.addEventListener('click', () => { current = i; update(); });
      indicators.appendChild(dot);
    });

    function update() {
      slider.style.transform = `translateX(-${current * 100}%)`;
      indicators.querySelectorAll('.indicator').forEach((d, i) => d.classList.toggle('active', i === current));
    }
    next && next.addEventListener('click', () => { current = (current + 1) % veilleData.length; update(); });
    prev && prev.addEventListener('click', () => { current = (current - 1 + veilleData.length) % veilleData.length; update(); });
    update();
  })();

  // ===== CERTIFICATIONS : SLIDER =====
  (function initCertSlider() {
    const container = document.querySelector('.certifications-container');
    const track = document.querySelector('.certifications-track');
    const prev = document.querySelector('.cert-prev');
    const next = document.querySelector('.cert-next');
    const dots = document.getElementById('cert-slider-indicators');
    if (!container || !track || !prev || !next || !dots) return;

    const cards = Array.from(track.children);
    const gap = 24;
    const step = () => cards[0].offsetWidth + gap;

    cards.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'indicator';
      d.addEventListener('click', () => container.scrollTo({ left: i * step(), behavior: 'smooth' }));
      dots.appendChild(d);
    });
    function updateDots() {
      const idx = Math.round(container.scrollLeft / step());
      dots.querySelectorAll('.indicator').forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    container.addEventListener('scroll', () => {
      clearTimeout(container._t);
      container._t = setTimeout(updateDots, 50);
    });
    next.addEventListener('click', () => container.scrollBy({ left: step(), behavior: 'smooth' }));
    prev.addEventListener('click', () => container.scrollBy({ left: -step(), behavior: 'smooth' }));
    updateDots();
  })();

  // ===== MODALE IMAGE (clic sur une certification) =====
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modal-image');
  if (imageModal && modalImg) {
    document.querySelectorAll('.screenshot-thumb').forEach(img => {
      img.addEventListener('click', function () {
        modalImg.src = this.src;
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });
    const closeImage = () => { imageModal.style.display = 'none'; document.body.style.overflow = 'auto'; };
    imageModal.addEventListener('click', e => { if (e.target === imageModal || e.target.classList.contains('modal-close')) closeImage(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && imageModal.style.display === 'block') closeImage(); });
  }

  // ===== MODALE COMPETENCES / PARCOURS =====
  const skillModal = document.getElementById('skillModal');
  if (skillModal) {
    const titleEl = document.getElementById('skillModalTitle');
    const descEl = document.getElementById('skillModalDescription');
    const linkEl = document.getElementById('skillModalWebsiteLink');
    const closeBtn = skillModal.querySelector('.skill-modal-close');
    const prevBtn = skillModal.querySelector('.skill-modal-nav.prev');
    const nextBtn = skillModal.querySelector('.skill-modal-nav.next');

    // Textes à adapter avec ce que tu as réellement fait
    const skills = {
      ticketing: { title: 'Ticketing', description: "Décris ici comment tu gères les tickets (outil utilisé, par exemple GLPI), en cours ou en entreprise : création, suivi, résolution." },
      virtualisation: { title: 'Virtualisation', description: "Décris les hyperviseurs que tu as utilisés (VirtualBox, VMware, Proxmox, Hyper-V…) et ce que tu as monté comme maquettes." },
      ad: { title: 'Active Directory', description: "Décris ce que tu sais faire : gestion des utilisateurs, groupes, unités d'organisation, GPO, partages." },
      reseaux: { title: 'TCP/IP & Réseaux', description: "Décris tes bases : adressage IP, sous-réseaux, VLAN, routage, DHCP, DNS." },
      cisco: { title: 'Cisco Packet Tracer', description: "Décris les TP réalisés : simulation d'infrastructures, configuration de switchs et routeurs Cisco." },
      windows: { title: 'Windows Server', description: "Décris les rôles que tu as installés et configurés : AD DS, DNS, DHCP, serveur de fichiers, impression…" },
      linux: { title: 'Linux (Debian/Ubuntu)', description: "Décris ce que tu fais sous Linux : installation, services, commandes d'administration, dépannage." },
      vscode: { title: 'Visual Studio Code', description: "Décris comment tu l'utilises : scripts, pages web, documentation, extensions." }
    };
    const parcours = {
      'bts-sio': { title: 'BTS SIO option SISR', description: "Brevet de Technicien Supérieur Services Informatiques aux Organisations, option Solutions d'Infrastructure, Systèmes et Réseaux. Ajoute ici ce que tu y as appris.", website: '#', category: 'school' },
      'bac': { title: '[Baccalauréat]', description: "Décris ton bac et ce qu'il t'a apporté.", website: '#', category: 'school' },
      'exp1': { title: '[Expérience 1]', description: "Décris tes missions, les outils utilisés et ce que tu as appris.", website: '#', category: 'company' },
      'exp2': { title: '[Expérience 2]', description: "Décris tes missions, les outils utilisés et ce que tu as appris.", website: '#', category: 'company' }
    };

    let type = '', order = [], index = 0;

    function render(kind, key) {
      const data = kind === 'skill' ? skills[key] : parcours[key];
      if (!data) return;
      order = kind === 'skill'
        ? Array.from(document.querySelectorAll('.skill-learn-more')).map(el => el.dataset.skill)
        : Array.from(document.querySelectorAll('.btn-learn-more-parcours')).map(el => el.dataset.id);
      index = order.indexOf(key);
      titleEl.textContent = data.title;
      descEl.textContent = data.description;
      linkEl.innerHTML = '';
      if (data.website && data.website !== '#') {
        const a = document.createElement('a');
        a.href = data.website;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = data.category === 'school' ? "Site de l'école" : "Site de l'entreprise";
        linkEl.appendChild(a);
      }
    }
    function open(kind, key) {
      type = kind;
      render(kind, key);
      skillModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
    function close() { skillModal.style.display = 'none'; document.body.style.overflow = 'auto'; }

    document.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('click', e => {
        e.preventDefault();
        const link = card.querySelector('.skill-learn-more');
        if (link) open('skill', link.dataset.skill);
      });
    });
    document.querySelectorAll('.btn-learn-more-parcours').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); open('parcours', btn.dataset.id); });
    });

    closeBtn.addEventListener('click', close);
    skillModal.addEventListener('click', e => { if (e.target === skillModal) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && skillModal.style.display === 'block') close(); });
    prevBtn.addEventListener('click', () => { index = (index - 1 + order.length) % order.length; render(type, order[index]); });
    nextBtn.addEventListener('click', () => { index = (index + 1) % order.length; render(type, order[index]); });
  }

  // ===== EFFET PARALLAXE LEGER =====
  const floating = document.querySelectorAll('.floating-element');
  if (floating.length) {
    window.addEventListener('scroll', () => {
      floating.forEach((el, i) => {
        el.style.marginTop = (window.pageYOffset * (0.1 + i * 0.05)) + 'px';
      });
    });
  }
});
