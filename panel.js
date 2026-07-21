const CUENTAS = {
  admin: { clave: '1234', destino: 'panel-negocio' },
  agente: { clave: '1234', destino: 'panel-agente' },
};

const clientesBase = [
  { nombre: 'María Fernández', pais: 'Perú', estado: 'Activo' },
  { nombre: 'Carlos Pérez', pais: 'Venezuela', estado: 'Activo' },
  { nombre: 'Ana Gómez', pais: 'Colombia', estado: 'Activo' },
  { nombre: 'Luis Rodríguez', pais: 'Ecuador', estado: 'Inactivo' },
  { nombre: 'Daniela Torres', pais: 'Perú', estado: 'Activo' },
];

const cobrarBase = [
  { cliente: 'María Fernández', monto: 1250, moneda: 'USD', fecha: '2026-07-15' },
  { cliente: 'Ana Gómez', monto: 3800, moneda: 'PEN', fecha: '2026-07-18' },
  { cliente: 'Daniela Torres', monto: 640, moneda: 'USD', fecha: '2026-07-20' },
];

const pagarBase = [
  { proveedor: 'Banco Mercantil', monto: 2200, moneda: 'USD', fecha: '2026-07-22' },
  { proveedor: 'Banesco', monto: 1500, moneda: 'USD', fecha: '2026-07-25' },
  { proveedor: 'BBVA Provincial', monto: 900, moneda: 'USD', fecha: '2026-07-28' },
];

const divisasBase = [
  { moneda: 'Dólar (USD)', compra: 3.75, venta: 3.80 },
  { moneda: 'Sol (PEN)', compra: 1.00, venta: 1.00 },
  { moneda: 'Bolívar (VES)', compra: 38.20, venta: 39.10 },
];

function leerGuardado(clave) {
  return JSON.parse(localStorage.getItem(clave) || '[]');
}

function agregarGuardado(clave, registro) {
  const lista = leerGuardado(clave);
  lista.push(registro);
  localStorage.setItem(clave, JSON.stringify(lista));
}

function formatearMonto(monto, moneda) {
  return `${Number(monto).toLocaleString('es')} ${moneda}`;
}

function llenarClientes() {
  const tbody = document.querySelector('#seccion-clientes tbody');
  tbody.innerHTML = '';
  const todos = [...clientesBase, ...leerGuardado('guro_clientes')];
  todos.forEach((c) => {
    const fila = document.createElement('tr');
    const claseEstado = c.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo';
    fila.innerHTML = `<td>${c.nombre}</td><td>${c.pais}</td><td class="${claseEstado}">${c.estado}</td>`;
    tbody.appendChild(fila);
  });
}

function llenarCuentas(base, claveGuardado, selectorTabla, columnaNombre, idTotal) {
  const tbody = document.querySelector(`${selectorTabla} tbody`);
  tbody.innerHTML = '';
  const todos = [...base, ...leerGuardado(claveGuardado)];
  let total = 0;
  todos.forEach((item) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td>${item[columnaNombre]}</td><td>${formatearMonto(item.monto, item.moneda)}</td><td>${item.fecha}</td>`;
    tbody.appendChild(fila);
    if (item.moneda === 'USD') total += Number(item.monto);
  });
  document.getElementById(idTotal).textContent = `${total.toLocaleString('es')} USD (aprox.)`;
}

function llenarDivisas() {
  const contenedor = document.querySelector('.divisas-grid');
  contenedor.innerHTML = '';
  const todas = [...divisasBase, ...leerGuardado('guro_divisas')];
  todas.forEach((d) => {
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

function cargarPanelAdmin() {
  llenarClientes();
  llenarCuentas(cobrarBase, 'guro_cobrar', '#seccion-cobrar', 'cliente', 'total-cobrar');
  llenarCuentas(pagarBase, 'guro_pagar', '#seccion-pagar', 'proveedor', 'total-pagar');
  llenarDivisas();
}

const formLogin = document.getElementById('form-login');
const pantallaLogin = document.getElementById('pantalla-login');
const panelNegocio = document.getElementById('panel-negocio');
const panelAgente = document.getElementById('panel-agente');
const errorLogin = document.getElementById('error-login');
const campoUsuario = document.getElementById('usuario');
const botonesRol = document.querySelectorAll('.rol-btn');
let rolActivo = 'admin';

botonesRol.forEach((boton) => {
  boton.addEventListener('click', () => {
    botonesRol.forEach((b) => b.classList.remove('activo'));
    boton.classList.add('activo');
    rolActivo = boton.dataset.rol;
  });
});

formLogin.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const usuario = campoUsuario.value.trim();
  const clave = document.getElementById('clave').value;
  const cuenta = CUENTAS[usuario];

  if (cuenta && cuenta.clave === clave && usuario === rolActivo) {
    errorLogin.textContent = '';
    pantallaLogin.hidden = true;
    if (cuenta.destino === 'panel-negocio') {
      panelNegocio.hidden = false;
      cargarPanelAdmin();
    } else {
      panelAgente.hidden = false;
    }
  } else {
    errorLogin.textContent = 'Usuario o contraseña incorrectos.';
  }
});

function cerrarSesion(panel) {
  panel.hidden = true;
  formLogin.reset();
  rolActivo = 'admin';
  botonesRol.forEach((b) => b.classList.toggle('activo', b.dataset.rol === 'admin'));
  document.getElementById('confirmacion-agente').textContent = '';
  pantallaLogin.hidden = false;
}

document.getElementById('btn-salir').addEventListener('click', () => cerrarSesion(panelNegocio));
document.getElementById('btn-salir-agente').addEventListener('click', () => cerrarSesion(panelAgente));

function mostrarConfirmacion(texto) {
  const nota = document.getElementById('confirmacion-agente');
  nota.textContent = texto;
  setTimeout(() => { nota.textContent = ''; }, 3000);
}

document.getElementById('form-cliente').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  agregarGuardado('guro_clientes', {
    nombre: datos.get('nombre'),
    pais: datos.get('pais'),
    estado: datos.get('estado'),
  });
  evento.target.reset();
  mostrarConfirmacion('Cliente agregado correctamente.');
});

document.getElementById('form-cobrar').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  agregarGuardado('guro_cobrar', {
    cliente: datos.get('cliente'),
    monto: Number(datos.get('monto')),
    moneda: datos.get('moneda'),
    fecha: datos.get('fecha'),
  });
  evento.target.reset();
  mostrarConfirmacion('Cuenta por cobrar agregada correctamente.');
});

document.getElementById('form-pagar').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  agregarGuardado('guro_pagar', {
    proveedor: datos.get('proveedor'),
    monto: Number(datos.get('monto')),
    moneda: datos.get('moneda'),
    fecha: datos.get('fecha'),
  });
  evento.target.reset();
  mostrarConfirmacion('Cuenta por pagar agregada correctamente.');
});

document.getElementById('form-divisa').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  agregarGuardado('guro_divisas', {
    moneda: datos.get('moneda'),
    compra: Number(datos.get('compra')),
    venta: Number(datos.get('venta')),
  });
  evento.target.reset();
  mostrarConfirmacion('Divisa actualizada correctamente.');
});
