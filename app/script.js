(function () {
  'use strict';

  const els = {
    m: initElements('m'),
    h: initElements('h'),
  };

  function initElements(type) {
    const els = [{}, {}];

    if (!['m', 'h'].includes(type)) return els;

    const target = document.querySelector(`.flip-clock-${type}`);

    if (!target) return els;

    let el;

    el = els[0];
    el.digit = target.querySelector('.digit-left');
    el.card = el.digit.querySelector('.card');
    el.cardFaces = el.card.querySelectorAll('.card-face');
    el.cardFaceA = el.cardFaces[0];
    el.cardFaceB = el.cardFaces[1];

    el = els[1];
    el.digit = target.querySelector('.digit-right');
    el.card = el.digit.querySelector('.card');
    el.cardFaces = el.card.querySelectorAll('.card-face');
    el.cardFaceA = el.cardFaces[0];
    el.cardFaceB = el.cardFaces[1];

    return els;
  }

  (function runClock() {
    if (!document.hidden) {
      const date = new Date();
      const now = {
        h: date.getHours(),
        m: date.getMinutes()
      };
      now.h = now.h < 10 ? `0${now.h}` : `${now.h}`;
      now.m = now.m < 10 ? `0${now.m}` : `${now.m}`;
      now.h0 = now.h[0];
      now.h1 = now.h[1];
      now.m0 = now.m[0];
      now.m1 = now.m[1];
      console.log(`${now.h0}${now.h1}:${now.m0}${now.m1}`);

      for (const t of Object.keys(els)) {
        for (const i of ['0', '1']) {
          const curr = now[`${t}${i}`];
          let next = +curr + 1;
          if (t === 'h') {
            if (i === '0') next = next <= 2 ? `${next}` : '0';
            if (i === '1') next = next <= 3 ? `${next}` : '0';
          }
          if (t === 'm') {
            if (i === '0') next = next <= 5 ? `${next}` : '0';
            if (i === '1') next = next <= 9 ? `${next}` : '0';
          }
          const el = els[t][i];
          if (el && el.digit) {
            if (!el.digit.dataset.digitBefore) {
              el.digit.dataset.digitBefore = curr;
              el.cardFaceA.textContent = el.digit.dataset.digitBefore;
              el.digit.dataset.digitAfter = next;
              el.cardFaceB.textContent = el.digit.dataset.digitAfter;
            } else if (el.digit.dataset.digitBefore !== curr) {
              el.card.addEventListener('transitionend', function () {
                el.digit.dataset.digitBefore = curr;
                el.cardFaceA.textContent = el.digit.dataset.digitBefore;

                const cardClone = el.card.cloneNode(true);
                cardClone.classList.remove('flipped');
                el.digit.replaceChild(cardClone, el.card);
                el.card = cardClone;
                el.cardFaces = el.card.querySelectorAll('.card-face');
                el.cardFaceA = el.cardFaces[0];
                el.cardFaceB = el.cardFaces[1];

                el.digit.dataset.digitAfter = next;
                el.cardFaceB.textContent = el.digit.dataset.digitAfter;
              }, { once: true });
              if (!el.card.classList.contains('flipped')) {
                el.card.classList.add('flipped');
              }
            }
          }
        }
      }
    }
    setTimeout(runClock, 1000);
  })();
})();

/* Dark Mode Toggle */

const toggle = document.getElementById('toggleLight');
const icon = document.querySelector('i');
const body = document.querySelector('body');
const root = document.querySelector(":root");

function applyLightTheme() {
  toggle.classList.remove('fa-sun');
  toggle.classList.add('fa-moon');
  body.style.background = '#ffffff';
  body.style.transition = '1.5s';
  root.style.setProperty("--cards-darkbg", '#E6E6E6');
  root.style.setProperty("--cards-darkcolor", '#55534E');
  root.style.setProperty("--cards-darkborder", '#ffff');
  icon.style.color = '#78766F';
}

function applyDarkTheme() {
  toggle.classList.remove('fa-moon');
  toggle.classList.add('fa-sun');
  body.style.background = '#191919';
  body.style.transition = '1.5s';
  root.style.setProperty("--cards-darkbg", '#000000');
  root.style.setProperty("--cards-darkcolor", '#B7B7B7');
  root.style.setProperty("--cards-darkborder", '#070707');
  icon.style.color = '#000000';
}

// Recuperar el tema del Local Storage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "dark") {
    toggle.classList.add('fa-sun');
    applyDarkTheme();
  } else {
    toggle.classList.add('fa-moon');
    applyLightTheme();
  }
});

function toggleTheme(theme) {
  if (theme === "dark") {
    applyDarkTheme();
    window.localStorage.setItem("theme", "dark");
  } else {
    applyLightTheme();
    window.localStorage.setItem("theme", "light");
  }
}

toggle.addEventListener('click', function () {
  const currentTheme = this.classList.contains('fa-moon') ? "light" : "dark";
  toggleTheme(currentTheme);
});
