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
