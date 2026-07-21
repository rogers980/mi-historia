const tagline = document.querySelector('.hero-tagline');
const textoCompleto = tagline.textContent;
tagline.textContent = '';

function escribirTagline(indice = 0) {
  tagline.textContent = textoCompleto.slice(0, indice);
  if (indice < textoCompleto.length) {
    setTimeout(() => escribirTagline(indice + 1), 45);
  }
}

setTimeout(escribirTagline, 500);

const musica = document.getElementById('musica-fondo');
const botonMusica = document.getElementById('musica-toggle');
musica.volume = 0.5;

botonMusica.addEventListener('click', () => {
  if (musica.paused) {
    musica.play();
    botonMusica.textContent = '⏸';
  } else {
    musica.pause();
    botonMusica.textContent = '🎵';
  }
});

function animarNumero(elemento) {
  const meta = parseInt(elemento.dataset.meta, 10);
  const duracion = 1200;
  const inicio = performance.now();

  function actualizar(ahora) {
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    elemento.textContent = Math.floor(progreso * meta);
    if (progreso < 1) {
      requestAnimationFrame(actualizar);
    } else {
      elemento.textContent = meta;
    }
  }

  requestAnimationFrame(actualizar);
}

const numeros = document.querySelectorAll('.stat-numero');

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animarNumero(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

numeros.forEach((numero) => statsObserver.observe(numero));

const hitos = document.querySelectorAll('.hito-card, .revelar');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

hitos.forEach((hito) => observer.observe(hito));

const botonArriba = document.getElementById('volver-arriba');
const navPrincipal = document.getElementById('nav-principal');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    botonArriba.classList.add('visible');
    navPrincipal.classList.add('visible');
  } else {
    botonArriba.classList.remove('visible');
    navPrincipal.classList.remove('visible');
  }
});

botonArriba.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const inicioAprendizaje = new Date('2026-07-21');
const msPorDia = 1000 * 60 * 60 * 24;
const dias = Math.floor((new Date() - inicioAprendizaje) / msPorDia) + 1;

document.getElementById('contador-dias').textContent =
  dias === 1 ? '1 día' : `${dias} días`;

async function actualizarContadorVisitas() {
  try {
    const respuesta = await fetch('https://abacus.jasoncameron.dev/hit/rogers980-mi-historia/visitas');
    const datos = await respuesta.json();
    document.getElementById('contador-visitas').textContent = datos.value;
  } catch (error) {
    document.getElementById('contador-visitas').textContent = '—';
  }
}

actualizarContadorVisitas();
