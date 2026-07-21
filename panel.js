const CUENTAS = {
  admin: { clave: '1234', destino: 'panel-admin.html' },
  agente: { clave: '1234', destino: 'panel-agente.html' },
};

const clientesBase = [
  { nombre: 'María Fernández', pais: 'Perú', estado: 'Activo' },
  { nombre: 'Carlos Pérez', pais: 'Venezuela', estado: 'Activo' },
  { nombre: 'Ana Gómez', pais: 'Colombia', estado: 'Activo' },
  { nombre: 'Luis Rodríguez', pais: 'Ecuador', estado: 'Inactivo' },
  { nombre: 'Daniela Torres', pais: 'Perú', estado: 'Activo' },
  { nombre: 'Michael Johnson', pais: 'Estados Unidos', estado: 'Activo' },
  { nombre: 'Jennifer García', pais: 'Estados Unidos', estado: 'Activo' },
  { nombre: 'José Hernández', pais: 'México', estado: 'Activo' },
  { nombre: 'Guadalupe Martínez', pais: 'México', estado: 'Inactivo' },
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

const bancosExtranjero = [
  { pais: 'Colombia', banco: 'Bancolombia' },
  { pais: 'Chile', banco: 'Banco Santander' },
  { pais: 'Perú', banco: 'Banco BCP' },
  { pais: 'Perú', banco: 'Interbank' },
  { pais: 'Estados Unidos', banco: 'Zelle' },
  { pais: 'México', banco: 'Banco Azteca' },
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
  const contenedorVivo = document.querySelector('#seccion-tasas-vivo .divisas-grid');
  contenedorVivo.innerHTML = '';
  cargarTasasVES(contenedorVivo);
}

function crearTarjetaVES(titulo) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'divisa-card';
  tarjeta.innerHTML = `<div class="moneda">${titulo}</div><div class="tasas">Cargando...</div>`;
  return tarjeta;
}

function actualizarHistorial(clave, valorActual) {
  let historial;
  try {
    historial = JSON.parse(localStorage.getItem(clave));
    if (!Array.isArray(historial)) historial = [];
  } catch {
    historial = [];
  }
  historial.push(valorActual);
  while (historial.length > 12) historial.shift();
  localStorage.setItem(clave, JSON.stringify(historial));
  return historial;
}

function calcularTendencia(historial) {
  if (historial.length < 2 || historial[historial.length - 2] === historial[historial.length - 1]) {
    return '<span class="tendencia neutra">→ sin cambio</span>';
  }
  const anterior = historial[historial.length - 2];
  const actual = historial[historial.length - 1];
  const cambio = ((actual - anterior) / anterior) * 100;
  const sube = cambio > 0;
  const flecha = sube ? '▲' : '▼';
  const clase = sube ? 'sube' : 'baja';
  return `<span class="tendencia ${clase}">${flecha} ${Math.abs(cambio).toFixed(2)}%</span>`;
}

function dibujarSparkline(historial) {
  if (historial.length < 2) {
    return '<div class="sparkline-vacio">Gráfica disponible tras varias consultas</div>';
  }
  const ancho = 140;
  const alto = 36;
  const min = Math.min(...historial);
  const max = Math.max(...historial);
  const rango = max - min || 1;
  const paso = ancho / (historial.length - 1);
  const coords = historial.map((v, i) => [
    Number((i * paso).toFixed(1)),
    Number((alto - ((v - min) / rango) * alto).toFixed(1)),
  ]);
  const puntos = coords.map(([x, y]) => `${x},${y}`).join(' ');
  const [ultimoX, ultimoY] = coords[coords.length - 1];
  const areaId = `area-${Math.round(min * 1000)}-${coords.length}`;
  const puntosArea = `0,${alto} ${puntos} ${ancho},${alto}`;
  const sube = historial[historial.length - 1] >= historial[0];
  const color = sube ? '#6fd68a' : '#cf142b';
  return `
    <svg class="sparkline" viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="${areaId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.35" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0" />
        </linearGradient>
      </defs>
      <polygon points="${puntosArea}" fill="url(#${areaId})" stroke="none" />
      <polyline points="${puntos}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
      <circle cx="${ultimoX}" cy="${ultimoY}" r="2.5" fill="${color}" />
    </svg>
  `;
}

async function cargarTasasVES(contenedor) {
  const tarjetaBcv = crearTarjetaVES('Bolívar — BCV');
  const tarjetaBinance = crearTarjetaVES('Bolívar — Binance');
  const tarjetaMxn = crearTarjetaVES('Peso mexicano');
  const tarjetaCop = crearTarjetaVES('Peso colombiano');
  const tarjetaClp = crearTarjetaVES('Peso chileno');
  const tarjetaPen = crearTarjetaVES('Sol — Mercado');
  const tarjetaBtc = crearTarjetaVES('Bitcoin (BTC)');
  [tarjetaBcv, tarjetaBinance, tarjetaMxn, tarjetaCop, tarjetaClp, tarjetaPen, tarjetaBtc].forEach((t) => contenedor.appendChild(t));

  try {
    const respuesta = await fetch('https://ve.dolarapi.com/v1/dolares');
    if (!respuesta.ok) throw new Error('Respuesta no válida');
    const datos = await respuesta.json();

    const oficial = datos.find((d) => d.fuente === 'oficial');
    const paralelo = datos.find((d) => d.fuente === 'paralelo');

    if (oficial) {
      const historial = actualizarHistorial('guro_hist_bcv', oficial.promedio);
      tarjetaBcv.innerHTML = `
        <div class="moneda">Bolívar — BCV</div>
        <div class="tasas">1 USD = <span>${oficial.promedio.toFixed(2)} Bs</span></div>
        ${calcularTendencia(historial)}
        ${dibujarSparkline(historial)}
        <div class="divisa-nota">Oficial · ${new Date(oficial.fechaActualizacion).toLocaleDateString('es-VE')}</div>
      `;
    }
    if (paralelo) {
      const historial = actualizarHistorial('guro_hist_binance', paralelo.promedio);
      tarjetaBinance.innerHTML = `
        <div class="moneda">Bolívar — Binance</div>
        <div class="tasas">1 USD = <span>${paralelo.promedio.toFixed(2)} Bs</span></div>
        ${calcularTendencia(historial)}
        ${dibujarSparkline(historial)}
        <div class="divisa-nota">Paralelo/Binance · ${new Date(paralelo.fechaActualizacion).toLocaleDateString('es-VE')}</div>
      `;
    }
  } catch (error) {
    tarjetaBcv.innerHTML = '<div class="moneda">Bolívar — BCV</div><div class="tasas">No disponible</div>';
    tarjetaBinance.innerHTML = '<div class="moneda">Bolívar — Binance</div><div class="tasas">No disponible</div>';
  }

  try {
    const respuesta = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!respuesta.ok) throw new Error('Respuesta no válida');
    const datos = await respuesta.json();
    const fecha = new Date(datos.time_last_update_utc).toLocaleDateString('es-VE');

    const pares = [
      { tarjeta: tarjetaMxn, nombre: 'Peso mexicano', codigo: 'MXN', clave: 'guro_hist_mxn' },
      { tarjeta: tarjetaCop, nombre: 'Peso colombiano', codigo: 'COP', clave: 'guro_hist_cop' },
      { tarjeta: tarjetaClp, nombre: 'Peso chileno', codigo: 'CLP', clave: 'guro_hist_clp' },
      { tarjeta: tarjetaPen, nombre: 'Sol — Mercado', codigo: 'PEN', clave: 'guro_hist_pen' },
    ];

    pares.forEach(({ tarjeta, nombre, codigo, clave }) => {
      const valor = datos.rates[codigo];
      const historial = actualizarHistorial(clave, valor);
      tarjeta.innerHTML = `
        <div class="moneda">${nombre}</div>
        <div class="tasas">1 USD = <span>${valor.toFixed(2)} ${codigo}</span></div>
        ${calcularTendencia(historial)}
        ${dibujarSparkline(historial)}
        <div class="divisa-nota">Mercado · ${fecha}</div>
      `;
    });
  } catch (error) {
    [
      { tarjeta: tarjetaMxn, nombre: 'Peso mexicano' },
      { tarjeta: tarjetaCop, nombre: 'Peso colombiano' },
      { tarjeta: tarjetaClp, nombre: 'Peso chileno' },
      { tarjeta: tarjetaPen, nombre: 'Sol — Mercado' },
    ].forEach(({ tarjeta, nombre }) => {
      tarjeta.innerHTML = `<div class="moneda">${nombre}</div><div class="tasas">No disponible</div>`;
    });
  }

  try {
    const respuesta = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    if (!respuesta.ok) throw new Error('Respuesta no válida');
    const datos = await respuesta.json();
    const valor = datos.bitcoin.usd;
    const historial = actualizarHistorial('guro_hist_btc', valor);
    tarjetaBtc.innerHTML = `
      <div class="moneda">Bitcoin (BTC)</div>
      <div class="tasas">1 BTC = <span>$${valor.toLocaleString('es')}</span></div>
      ${calcularTendencia(historial)}
      ${dibujarSparkline(historial)}
      <div class="divisa-nota">CoinGecko · en vivo</div>
    `;
  } catch (error) {
    tarjetaBtc.innerHTML = '<div class="moneda">Bitcoin (BTC)</div><div class="tasas">No disponible</div>';
  }
}

function llenarBancos() {
  const tbody = document.querySelector('#seccion-bancos tbody');
  tbody.innerHTML = '';
  bancosExtranjero.forEach((b) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td>${b.pais}</td><td>${b.banco}</td>`;
    tbody.appendChild(fila);
  });
}

function cargarPanelAdmin() {
  llenarClientes();
  llenarCuentas(cobrarBase, 'guro_cobrar', '#seccion-cobrar', 'cliente', 'total-cobrar');
  llenarCuentas(pagarBase, 'guro_pagar', '#seccion-pagar', 'proveedor', 'total-pagar');
  llenarDivisas();
  llenarBancos();
}

/* ---------- PÁGINA DE LOGIN (panel.html) ---------- */
const formLogin = document.getElementById('form-login');
if (formLogin) {
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
      sessionStorage.setItem('guro_rol', usuario);
      window.location.href = cuenta.destino;
    } else {
      errorLogin.textContent = 'Usuario o contraseña incorrectos.';
    }
  });
}

/* ---------- PÁGINA DEL ADMINISTRADOR (panel-admin.html) ---------- */
const panelNegocio = document.getElementById('panel-negocio');
if (panelNegocio) {
  if (sessionStorage.getItem('guro_rol') !== 'admin') {
    window.location.href = 'panel.html';
  } else {
    cargarPanelAdmin();
    document.getElementById('btn-salir').addEventListener('click', () => {
      sessionStorage.removeItem('guro_rol');
      window.location.href = 'panel.html';
    });
  }
}

/* ---------- PÁGINA DEL AGENTE (panel-agente.html) ---------- */
const panelAgente = document.getElementById('panel-agente');
if (panelAgente) {
  if (sessionStorage.getItem('guro_rol') !== 'agente') {
    window.location.href = 'panel.html';
  } else {
    document.getElementById('btn-salir-agente').addEventListener('click', () => {
      sessionStorage.removeItem('guro_rol');
      window.location.href = 'panel.html';
    });

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
  }
}
