const hitos = document.querySelectorAll('.hito-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

hitos.forEach((hito) => observer.observe(hito));
