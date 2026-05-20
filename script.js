document.addEventListener('DOMContentLoaded', () => {
  // Year update
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile Menu
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const expanded = navLinks.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', expanded);
  });

  // Scroll Reveal
  const reveals = document.querySelectorAll('.glass-card, .section-title, .metric, .meth-item, blockquote');
  reveals.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));

  // 3D Tilt Effect
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  // Search Suggestions
  const searchInput = document.getElementById('smart-search');
  const suggestionsBox = document.getElementById('search-suggestions');
  const queries = ['Best CRM for Startups', 'ChatGPT vs Claude', 'Best Life Insurance in India', 'Top Business Bank Accounts', 'SaaS ROI Calculator', 'Cybersecurity Compliance Tools'];
  searchInput.addEventListener('input', () => {
    const val = searchInput.value.toLowerCase();
    suggestionsBox.innerHTML = '';
    if (val.length < 2) { suggestionsBox.hidden = true; return; }
    const matches = queries.filter(q => q.toLowerCase().includes(val));
    if (matches.length) {
      suggestionsBox.hidden = false;
      matches.forEach(match => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = match;
        div.addEventListener('click', () => { searchInput.value = match; suggestionsBox.hidden = true; });
        suggestionsBox.appendChild(div);
      });
    } else { suggestionsBox.hidden = true; }
  });
  document.addEventListener('click', e => { if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) suggestionsBox.hidden = true; });

  // ROI Calculator
  const roiForm = document.getElementById('roi-calc');
  const resultBox = document.getElementById('calc-result');
  roiForm.addEventListener('submit', e => {
    e.preventDefault();
    const cost = parseFloat(document.getElementById('monthly-cost').value) || 0;
    const hours = parseFloat(document.getElementById('hours-saved').value) || 0;
    const rate = parseFloat(document.getElementById('hourly-rate').value) || 0;
    const annualCost = cost * 12;
    const value = hours * rate * 12;
    const roi = annualCost === 0 ? 0 : ((value - annualCost) / annualCost) * 100;
    document.getElementById('res-cost').textContent = `$${annualCost.toLocaleString()}`;
    document.getElementById('res-value').textContent = `$${value.toLocaleString()}`;
    document.getElementById('res-roi').textContent = `${roi.toFixed(1)}%`;
    resultBox.classList.remove('hidden');
  });

  // Exit Intent Modal
  const modal = document.getElementById('exit-modal');
  let shown = false;
  document.addEventListener('mouseleave', e => {
    if (e.clientY < 0 && !shown) { modal.classList.remove('hidden'); shown = true; }
  });
  document.querySelector('.modal-close').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
});
