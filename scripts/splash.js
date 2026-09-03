/* ===================================================
   PROFESOR JHONY — splash.js
   Netflix-style intro: long-shadow smear that snaps into
   the brand color, then fades to reveal the site.
   =================================================== */
(function () {
  var splash = document.getElementById('splash');
  var text = document.getElementById('splashText');
  if (!splash || !text) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var alreadyShown = false;
  try { alreadyShown = sessionStorage.getItem('splashShown') === '1'; } catch (e) {}

  function hideSplash(animated) {
    document.documentElement.classList.remove('splash-lock');
    if (!animated) {
      splash.style.display = 'none';
      return;
    }
    splash.classList.add('splash-hidden');
    setTimeout(function () { splash.style.display = 'none'; }, 650);
  }

  if (reduceMotion || alreadyShown) {
    hideSplash(false);
    return;
  }

  document.documentElement.classList.add('splash-lock');

  function makeLongShadow(length, angle, color) {
    var val = '0px 0px transparent';
    for (var i = 1; i <= length; i++) {
      val += ', ' + i + 'px ' + (i * angle) + 'px ' + color;
    }
    return val;
  }

  var shadowColor = 'rgba(232,163,61,0.35)';
  text.style.setProperty('--long-shadow-a', makeLongShadow(70, 1, shadowColor));
  text.style.setProperty('--long-shadow-b', makeLongShadow(70, 1.6, shadowColor));

  requestAnimationFrame(function () {
    text.classList.add('play');
  });

  function finish() {
    try { sessionStorage.setItem('splashShown', '1'); } catch (e) {}
    hideSplash(true);
  }

  text.addEventListener('animationend', finish, { once: true });

  /* Safety net in case animationend never fires */
  setTimeout(function () {
    if (!splash.classList.contains('splash-hidden')) finish();
  }, 3200);
})();
