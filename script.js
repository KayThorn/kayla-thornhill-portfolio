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
  { name: "Governance & Compliance (GRC)", discipline: "Governance & Compliance", term: "governance", hours: "45", courses: "", certs: "" },
  { name: "NDAs & Agreements", discipline: "Governance & Compliance", term: "agreements", hours: "15", courses: "", certs: "" },
  { name: "HR Documentation", discipline: "Governance & Compliance", term: "documentation", hours: "18", courses: "1", certs: "Diploma in Human Resources (HR) — Alison (2026)" },
  { name: "Power Apps", discipline: "Platforms & Building", term: "power apps", hours: "18", courses: "", certs: "" },
  { name: "SharePoint Lists", discipline: "Platforms & Building", term: "sharepoint", hours: "10", courses: "", certs: "" },
  { name: "Power Automate", discipline: "Platforms & Building", term: "power automate", hours: "4", courses: "", certs: "" },
  { name: "JavaScript", discipline: "Platforms & Building", term: "javascript", hours: "25", courses: "", certs: "" },
  { name: "Next.js", discipline: "Platforms & Building", term: "next.js", hours: "10", courses: "", certs: "" },
  { name: "Supabase", discipline: "Platforms & Building", term: "supabase", hours: "5", courses: "", certs: "" },
  { name: "UX Research", discipline: "UX Research", term: "ux", hours: "90", courses: "4 (Google UX Design Certificate, in progress)", certs: "" },
  { name: "Usability Studies", discipline: "UX Research", term: "usability", hours: "18", courses: "", certs: "" },
  { name: "Figma", discipline: "UX Research", term: "figma", hours: "12", courses: "", certs: "" },
  { name: "Research Synthesis", discipline: "UX Research", term: "synthesis", hours: "12", courses: "", certs: "" },
  { name: "Prioritization", discipline: "UX Research", term: "prioritization", hours: "6", courses: "", certs: "" },
  { name: "IT Support", discipline: "Security & IT", term: "support", hours: "250", courses: "", certs: "" },
  { name: "Linux", discipline: "Security & IT", term: "linux", hours: "15", courses: "", certs: "" },
  { name: "Security+ (in training)", discipline: "Security & IT", term: "security", hours: "3", courses: "", certs: "" },
  { name: "SOC Fundamentals", discipline: "Security & IT", term: "security", hours: "8", courses: "2", certs: "SOC Bootcamp Certificate of Participation, 5 CPE — Thinkcloudly (2026)" },
  { name: "SQL", discipline: "Data & Analytics", term: "sql", hours: "35", courses: "1 (semester-long college data analytics program)", certs: "" },
  { name: "MySQL", discipline: "Data & Analytics", term: "mysql", hours: "40", courses: "2", certs: "Diploma in MySQL and Statistics for Data Analysis — Alison (2026)" },
  { name: "MariaDB", discipline: "Data & Analytics", term: "mariadb", hours: "4", courses: "", certs: "" },
  { name: "PostgreSQL", discipline: "Data & Analytics", term: "postgresql", hours: "5", courses: "", certs: "" },
  { name: "KNIME", discipline: "Data & Analytics", term: "knime", hours: "20", courses: "2", certs: "Basic Proficiency in KNIME Analytics Platform (2026) · Introduction to KNIME — DataCamp (2026)" },
  { name: "Tableau", discipline: "Data & Analytics", term: "tableau", hours: "10", courses: "", certs: "" },
  { name: "Data Visualization", discipline: "Data & Analytics", term: "data visualization", hours: "25", courses: "2", certs: "Data Visualization — DataCamp (2026)" },
  { name: "NocoDB", discipline: "Data & Analytics", term: "nocodb", hours: "8", courses: "", certs: "" },
  { name: "Git", discipline: "Platforms & Building", term: "git", hours: "10", courses: "", certs: "" },
  { name: "GitHub", discipline: "Platforms & Building", term: "github", hours: "6", courses: "", certs: "" },
  { name: "Node.js", discipline: "Platforms & Building", term: "node.js", hours: "6", courses: "", certs: "" },
  { name: "Vercel", discipline: "Platforms & Building", term: "vercel", hours: "3", courses: "", certs: "" },
  { name: "Expo", discipline: "Platforms & Building", term: "expo", hours: "2", courses: "", certs: "" },
  { name: "Amazon ECS", discipline: "Platforms & Building", term: "amazon ecs", hours: "15", courses: "", certs: "" },
  { name: "Salesforce", discipline: "Platforms & Building", term: "salesforce", hours: "150", courses: "", certs: "" },
  { name: "ServiceNow", discipline: "Platforms & Building", term: "servicenow", hours: "5", courses: "", certs: "" }
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
