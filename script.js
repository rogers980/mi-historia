const hitos = document.querySelectorAll('.hito-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

hitos.forEach((hito) => observer.observe(hito));

const botonModo = document.getElementById('modo-toggle');

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  botonModo.textContent = tema === 'oscuro' ? '☀️' : '🌙';
  localStorage.setItem('tema', tema);
}

const temaGuardado = localStorage.getItem('tema');
const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
aplicarTema(temaGuardado || (prefiereOscuro ? 'oscuro' : 'claro'));

botonModo.addEventListener('click', () => {
  const temaActual = document.documentElement.getAttribute('data-tema');
  aplicarTema(temaActual === 'oscuro' ? 'claro' : 'oscuro');
});

const botonArriba = document.getElementById('volver-arriba');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    botonArriba.classList.add('visible');
  } else {
    botonArriba.classList.remove('visible');
  }
});

botonArriba.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
