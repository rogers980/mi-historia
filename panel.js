const USUARIO_DEMO = 'admin';
const CLAVE_DEMO = '1234';

const clientes = [
  { nombre: 'María Fernández', pais: 'Perú', estado: 'Activo' },
  { nombre: 'Carlos Pérez', pais: 'Venezuela', estado: 'Activo' },
  { nombre: 'Ana Gómez', pais: 'Colombia', estado: 'Activo' },
  { nombre: 'Luis Rodríguez', pais: 'Ecuador', estado: 'Inactivo' },
  { nombre: 'Daniela Torres', pais: 'Perú', estado: 'Activo' },
];

const cuentasPorCobrar = [
  { cliente: 'María Fernández', monto: 1250, moneda: 'USD', fecha: '2026-07-15' },
  { cliente: 'Ana Gómez', monto: 3800, moneda: 'PEN', fecha: '2026-07-18' },
  { cliente: 'Daniela Torres', monto: 640, moneda: 'USD', fecha: '2026-07-20' },
];

const cuentasPorPagar = [
  { proveedor: 'Banco Mercantil', monto: 2200, moneda: 'USD', fecha: '2026-07-22' },
  { proveedor: 'Banesco', monto: 1500, moneda: 'USD', fecha: '2026-07-25' },
  { proveedor: 'BBVA Provincial', monto: 900, moneda: 'USD', fecha: '2026-07-28' },
];

const divisas = [
  { moneda: 'Dólar (USD)', compra: 3.75, venta: 3.80 },
  { moneda: 'Sol (PEN)', compra: 1.00, venta: 1.00 },
  { moneda: 'Bolívar (VES)', compra: 38.20, venta: 39.10 },
];

function formatearMonto(monto, moneda) {
  return `${monto.toLocaleString('es')} ${moneda}`;
}

function llenarClientes() {
  const tbody = document.querySelector('#seccion-clientes tbody');
  clientes.forEach((c) => {
    const fila = document.createElement('tr');
    const claseEstado = c.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo';
    fila.innerHTML = `<td>${c.nombre}</td><td>${c.pais}</td><td class="${claseEstado}">${c.estado}</td>`;
    tbody.appendChild(fila);
  });
}

function llenarCuentas(lista, selectorTabla, columnaNombre, idTotal) {
  const tbody = document.querySelector(`${selectorTabla} tbody`);
  let total = 0;
  lista.forEach((item) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td>${item[columnaNombre]}</td><td>${formatearMonto(item.monto, item.moneda)}</td><td>${item.fecha}</td>`;
    tbody.appendChild(fila);
    if (item.moneda === 'USD') total += item.monto;
  });
  document.getElementById(idTotal).textContent = `${total.toLocaleString('es')} USD (aprox.)`;
}

function llenarDivisas() {
  const contenedor = document.querySelector('.divisas-grid');
  divisas.forEach((d) => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'divisa-card';
    tarjeta.innerHTML = `
      <div class="moneda">${d.moneda}</div>
      <div class="tasas">Compra: <span>${d.compra}</span></div>
      <div class="tasas">Venta: <span>${d.venta}</span></div>
    `;
    contenedor.appendChild(tarjeta);
  });
}

function cargarPanel() {
  llenarClientes();
  llenarCuentas(cuentasPorCobrar, '#seccion-cobrar', 'cliente', 'total-cobrar');
  llenarCuentas(cuentasPorPagar, '#seccion-pagar', 'proveedor', 'total-pagar');
  llenarDivisas();
}

const formLogin = document.getElementById('form-login');
const pantallaLogin = document.getElementById('pantalla-login');
const panelNegocio = document.getElementById('panel-negocio');
const errorLogin = document.getElementById('error-login');
const botonSalir = document.getElementById('btn-salir');

formLogin.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const clave = document.getElementById('clave').value;

  if (usuario === USUARIO_DEMO && clave === CLAVE_DEMO) {
    errorLogin.textContent = '';
    pantallaLogin.hidden = true;
    panelNegocio.hidden = false;
    cargarPanel();
  } else {
    errorLogin.textContent = 'Usuario o contraseña incorrectos.';
  }
});

botonSalir.addEventListener('click', () => {
  panelNegocio.hidden = true;
  document.querySelector('#seccion-clientes tbody').innerHTML = '';
  document.querySelector('#seccion-cobrar tbody').innerHTML = '';
  document.querySelector('#seccion-pagar tbody').innerHTML = '';
  document.querySelector('.divisas-grid').innerHTML = '';
  formLogin.reset();
  pantallaLogin.hidden = false;
});
