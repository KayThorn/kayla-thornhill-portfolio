// Portfolio framework features (Kayla's confirmed design decisions, Nov 25, 2026):
// light/dark toggle, project search, footer skill shortcuts.

// Apply the saved theme before first paint where possible.
(function () {
  var stored = null;
  try { stored = localStorage.getItem('portfolio-theme'); } catch (e) {}
  if (stored) { document.documentElement.setAttribute('data-theme', stored); }
})();

document.addEventListener('DOMContentLoaded', function () {
  var btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('portfolio-theme', next); } catch (e) {}
    });
  }

  var input = document.getElementById('project-search');
  if (input) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.card[data-tags]'));
    var apply = function () {
      var q = input.value.trim().toLowerCase();
      cards.forEach(function (c) {
        var hay = (c.getAttribute('data-tags') + ' ' + c.textContent).toLowerCase();
        c.style.display = (!q || hay.indexOf(q) !== -1) ? '' : 'none';
      });
    };
    input.addEventListener('input', apply);
    var param = new URLSearchParams(window.location.search).get('skill');
    if (param) { input.value = param; apply(); }
  }
});

// ---- Skills data (framework seed from the skills already on this site).
// Kayla fills in hours / courses / certs; blank shows as "To fill in".
var SKILLS = [
  { name: "Governance & Compliance (GRC)", discipline: "Governance & Compliance", term: "governance", hours: "", courses: "", certs: "" },
  { name: "NDAs & Agreements", discipline: "Governance & Compliance", term: "agreements", hours: "", courses: "", certs: "" },
  { name: "HR Documentation", discipline: "Governance & Compliance", term: "documentation", hours: "", courses: "", certs: "" },
  { name: "Power Apps", discipline: "Platforms & Building", term: "power apps", hours: "", courses: "", certs: "" },
  { name: "SharePoint Lists", discipline: "Platforms & Building", term: "sharepoint", hours: "", courses: "", certs: "" },
  { name: "Power Automate", discipline: "Platforms & Building", term: "power automate", hours: "", courses: "", certs: "" },
  { name: "JavaScript", discipline: "Platforms & Building", term: "javascript", hours: "", courses: "", certs: "" },
  { name: "Next.js", discipline: "Platforms & Building", term: "next.js", hours: "", courses: "", certs: "" },
  { name: "Supabase", discipline: "Platforms & Building", term: "supabase", hours: "", courses: "", certs: "" },
  { name: "UX Research", discipline: "UX Research", term: "ux", hours: "", courses: "", certs: "" },
  { name: "Usability Studies", discipline: "UX Research", term: "usability", hours: "", courses: "", certs: "" },
  { name: "Figma", discipline: "UX Research", term: "figma", hours: "", courses: "", certs: "" },
  { name: "Research Synthesis", discipline: "UX Research", term: "synthesis", hours: "", courses: "", certs: "" },
  { name: "Prioritization", discipline: "UX Research", term: "prioritization", hours: "", courses: "", certs: "" },
  { name: "IT Support", discipline: "Security & IT", term: "support", hours: "", courses: "", certs: "" },
  { name: "Linux", discipline: "Security & IT", term: "linux", hours: "", courses: "", certs: "" },
  { name: "Security+ (in training)", discipline: "Security & IT", term: "security", hours: "", courses: "", certs: "" },
  { name: "SOC Fundamentals", discipline: "Security & IT", term: "security", hours: "", courses: "", certs: "" }
];

function fillIn(v) { return v && String(v).trim() ? v : "To fill in"; }

document.addEventListener('DOMContentLoaded', function () {
  // Home page skills dropdown: choosing a skill filters the project list.
  var jump = document.getElementById('skill-jump');
  if (jump) {
    SKILLS.slice().sort(function (a, b) { return a.name.localeCompare(b.name); }).forEach(function (s) {
      var o = document.createElement('option');
      o.value = s.term; o.textContent = s.name;
      jump.appendChild(o);
    });
    jump.addEventListener('change', function () {
      if (!jump.value) return;
      var input = document.getElementById('project-search');
      if (input) {
        input.value = jump.value;
        input.dispatchEvent(new Event('input'));
        input.scrollIntoView();
      } else {
        window.location.href = 'projects.html?skill=' + encodeURIComponent(jump.value);
      }
    });
  }

  // Skills page: list (alphabetical or by discipline) + clickable detail.
  var listEl = document.getElementById('skill-list');
  var detailEl = document.getElementById('skill-detail');
  if (listEl && detailEl) {
    var mode = 'alpha';
    function openSkill(s) {
      detailEl.innerHTML =
        '<h3>' + s.name + '</h3>' +
        '<dl>' +
        '<dt>Discipline</dt><dd>' + s.discipline + '</dd>' +
        '<dt>Hours put in (est.)</dt><dd>' + fillIn(s.hours) + '</dd>' +
        '<dt>Courses taken</dt><dd>' + fillIn(s.courses) + '</dd>' +
        '<dt>Certificates received</dt><dd>' + fillIn(s.certs) + '</dd>' +
        '</dl>' +
        '<p><a href="index.html?skill=' + encodeURIComponent(s.term) + '">See projects using this skill &rarr;</a></p>';
      detailEl.scrollIntoView({ block: 'nearest' });
    }
    function row(s, showDisc) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'skill-row';
      b.innerHTML = s.name + (showDisc ? ' <span class="disc">— ' + s.discipline + '</span>' : '');
      b.addEventListener('click', function () { openSkill(s); });
      return b;
    }
    function render() {
      listEl.innerHTML = '';
      if (mode === 'alpha') {
        SKILLS.slice().sort(function (a, b) { return a.name.localeCompare(b.name); })
          .forEach(function (s) { listEl.appendChild(row(s, true)); });
      } else {
        var groups = {};
        SKILLS.forEach(function (s) { (groups[s.discipline] = groups[s.discipline] || []).push(s); });
        Object.keys(groups).sort().forEach(function (g) {
          var h = document.createElement('h3');
          h.className = 'skill-list-group'; h.textContent = g;
          listEl.appendChild(h);
          groups[g].slice().sort(function (a, b) { return a.name.localeCompare(b.name); })
            .forEach(function (s) { listEl.appendChild(row(s, false)); });
        });
      }
      var ba = document.getElementById('view-alpha'), bd = document.getElementById('view-disc');
      if (ba && bd) {
        ba.classList.toggle('active', mode === 'alpha');
        bd.classList.toggle('active', mode === 'disc');
      }
    }
    var ba = document.getElementById('view-alpha'), bd = document.getElementById('view-disc');
    if (ba) ba.addEventListener('click', function () { mode = 'alpha'; render(); });
    if (bd) bd.addEventListener('click', function () { mode = 'disc'; render(); });
    render();
    if (window.location.hash) {
      var term = decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
      var match = SKILLS.filter(function (s) { return s.term === term || s.name.toLowerCase() === term; })[0];
      if (match) openSkill(match);
    }
  }
});

// Home page project carousel: manual controls only, no autoplay.
document.addEventListener('DOMContentLoaded', function () {
  var track = document.querySelector('.carousel-track');
  if (!track) return;
  var slides = track.children.length;
  var idx = 0;
  var count = document.getElementById('carousel-count');
  function show(i) {
    idx = (i + slides) % slides;
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    if (count) count.textContent = (idx + 1) + ' of ' + slides;
  }
  var prev = document.getElementById('carousel-prev');
  var next = document.getElementById('carousel-next');
  if (prev) prev.addEventListener('click', function () { show(idx - 1); });
  if (next) next.addEventListener('click', function () { show(idx + 1); });
  show(0);
});
