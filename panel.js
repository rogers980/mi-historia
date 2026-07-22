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
  { cliente: 'Pedro Ramírez (menudeo)', monto: 10, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Lucía Salazar (menudeo)', monto: 15, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Jorge Medina (menudeo)', monto: 20, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Rosa Delgado (menudeo)', monto: 30, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Iván Castillo (menudeo)', monto: 50, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Marta Rojas (menudeo)', monto: 75, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Tomás Vargas (menudeo)', monto: 100, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Elena Paredes (menudeo)', monto: 150, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Ricardo Núñez (menudeo)', monto: 200, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Valentina Cruz (menudeo)', monto: 300, moneda: 'USD', fecha: '2026-07-21' },
  { cliente: 'Andrés Molina (menudeo)', monto: 500, moneda: 'USD', fecha: '2026-07-21' },
];

const pagarBase = [
  { proveedor: 'Banco Mercantil', monto: 800, moneda: 'USD', fecha: '2026-07-22' },
  { proveedor: 'Banesco', monto: 500, moneda: 'USD', fecha: '2026-07-25' },
  { proveedor: 'BBVA Provincial', monto: 600, moneda: 'USD', fecha: '2026-07-28' },
  { proveedor: 'Bancolombia', monto: 350, moneda: 'USD', fecha: '2026-07-23' },
  { proveedor: 'Interbank', monto: 400, moneda: 'USD', fecha: '2026-07-24' },
  { proveedor: 'Banco Azteca', monto: 350, moneda: 'USD', fecha: '2026-07-26' },
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

function formatearNumero(valor, decimales = 2) {
  return Number(valor).toLocaleString('es', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

const BANDERAS_SVG = {
  'Perú': '<rect width="8" height="14" fill="#D91023"/><rect x="8" width="8" height="14" fill="#fff"/><rect x="16" width="8" height="14" fill="#D91023"/>',
  'Venezuela': '<rect width="24" height="4.67" fill="#ffcc00"/><rect y="4.67" width="24" height="4.67" fill="#0033a0"/><rect y="9.33" width="24" height="4.67" fill="#cf142b"/>',
  'Colombia': '<rect width="24" height="7" fill="#FCD116"/><rect y="7" width="24" height="3.5" fill="#003893"/><rect y="10.5" width="24" height="3.5" fill="#CE1126"/>',
  'Ecuador': '<rect width="24" height="7" fill="#FFDD00"/><rect y="7" width="24" height="3.5" fill="#034EA2"/><rect y="10.5" width="24" height="3.5" fill="#ED1C24"/>',
  'Estados Unidos': '<rect width="24" height="14" fill="#fff"/><rect width="24" height="1.6" fill="#B22234"/><rect y="3.2" width="24" height="1.6" fill="#B22234"/><rect y="6.4" width="24" height="1.6" fill="#B22234"/><rect y="9.6" width="24" height="1.6" fill="#B22234"/><rect y="12.8" width="24" height="1.2" fill="#B22234"/><rect width="10" height="7.5" fill="#3C3B6E"/>',
  'México': '<rect width="8" height="14" fill="#006341"/><rect x="8" width="8" height="14" fill="#fff"/><rect x="16" width="8" height="14" fill="#CE1126"/>',
  'Chile': '<rect width="24" height="7" fill="#fff"/><rect y="7" width="24" height="7" fill="#D52B1E"/><rect width="9" height="7" fill="#0039A6"/>',
};

function banderaPais(pais) {
  const contenido = BANDERAS_SVG[pais];
  if (!contenido) return '';
  return `<svg class="bandera-mini" viewBox="0 0 24 14" width="18" height="11">${contenido}</svg> `;
}

function llenarClientes() {
  const tbody = document.querySelector('#seccion-clientes tbody');
  tbody.innerHTML = '';
  const todos = [...clientesBase, ...leerGuardado('guro_clientes')];
  todos.forEach((c) => {
    const fila = document.createElement('tr');
    const claseEstado = c.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo';
    fila.innerHTML = `<td>${c.nombre}</td><td>${banderaPais(c.pais)}${c.pais}</td><td class="${claseEstado}">${c.estado}</td>`;
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
  if (historial.length === 0) {
    historial = [valorActual];
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
  const tarjetaBcv = crearTarjetaVES(`${banderaPais('Venezuela')}Bolívar — BCV`);
  const tarjetaBinance = crearTarjetaVES(`${banderaPais('Venezuela')}Bolívar — Binance`);
  const tarjetaMxn = crearTarjetaVES(`${banderaPais('México')}Peso mexicano`);
  const tarjetaCop = crearTarjetaVES(`${banderaPais('Colombia')}Peso colombiano`);
  const tarjetaClp = crearTarjetaVES(`${banderaPais('Chile')}Peso chileno`);
  const tarjetaPen = crearTarjetaVES(`${banderaPais('Perú')}Sol — Mercado`);
  const tarjetaBtc = crearTarjetaVES('₿ Bitcoin (BTC)');
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
        <div class="moneda">${banderaPais('Venezuela')}Bolívar — BCV</div>
        <div class="tasas">1 USD = <span>${formatearNumero(oficial.promedio)} Bs</span></div>
        ${calcularTendencia(historial)}
        ${dibujarSparkline(historial)}
        <div class="divisa-nota">Oficial · ${new Date(oficial.fechaActualizacion).toLocaleDateString('es-VE')}</div>
      `;
    }
    if (paralelo) {
      const historial = actualizarHistorial('guro_hist_binance', paralelo.promedio);
      tarjetaBinance.innerHTML = `
        <div class="moneda">${banderaPais('Venezuela')}Bolívar — Binance</div>
        <div class="tasas">1 USD = <span>${formatearNumero(paralelo.promedio)} Bs</span></div>
        ${calcularTendencia(historial)}
        ${dibujarSparkline(historial)}
        <div class="divisa-nota">Paralelo/Binance · ${new Date(paralelo.fechaActualizacion).toLocaleDateString('es-VE')}</div>
      `;
    }
  } catch (error) {
    tarjetaBcv.innerHTML = `<div class="moneda">${banderaPais('Venezuela')}Bolívar — BCV</div><div class="tasas">No disponible</div>`;
    tarjetaBinance.innerHTML = `<div class="moneda">${banderaPais('Venezuela')}Bolívar — Binance</div><div class="tasas">No disponible</div>`;
  }

  try {
    const respuesta = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!respuesta.ok) throw new Error('Respuesta no válida');
    const datos = await respuesta.json();
    const fecha = new Date(datos.time_last_update_utc).toLocaleDateString('es-VE');

    const pares = [
      { tarjeta: tarjetaMxn, nombre: `${banderaPais('México')}Peso mexicano`, codigo: 'MXN', clave: 'guro_hist_mxn' },
      { tarjeta: tarjetaCop, nombre: `${banderaPais('Colombia')}Peso colombiano`, codigo: 'COP', clave: 'guro_hist_cop' },
      { tarjeta: tarjetaClp, nombre: `${banderaPais('Chile')}Peso chileno`, codigo: 'CLP', clave: 'guro_hist_clp' },
      { tarjeta: tarjetaPen, nombre: `${banderaPais('Perú')}Sol — Mercado`, codigo: 'PEN', clave: 'guro_hist_pen' },
    ];

    pares.forEach(({ tarjeta, nombre, codigo, clave }) => {
      const valor = datos.rates[codigo];
      const historial = actualizarHistorial(clave, valor);
      tarjeta.innerHTML = `
        <div class="moneda">${nombre}</div>
        <div class="tasas">1 USD = <span>${formatearNumero(valor)} ${codigo}</span></div>
        ${calcularTendencia(historial)}
        ${dibujarSparkline(historial)}
        <div class="divisa-nota">Mercado · ${fecha}</div>
      `;
    });
  } catch (error) {
    [
      { tarjeta: tarjetaMxn, nombre: `${banderaPais('México')}Peso mexicano` },
      { tarjeta: tarjetaCop, nombre: `${banderaPais('Colombia')}Peso colombiano` },
      { tarjeta: tarjetaClp, nombre: `${banderaPais('Chile')}Peso chileno` },
      { tarjeta: tarjetaPen, nombre: `${banderaPais('Perú')}Sol — Mercado` },
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
      <div class="moneda">₿ Bitcoin (BTC)</div>
      <div class="tasas">1 BTC = <span>$${formatearNumero(valor, 0)}</span></div>
      ${calcularTendencia(historial)}
      ${dibujarSparkline(historial)}
      <div class="divisa-nota">CoinGecko · en vivo</div>
    `;
  } catch (error) {
    tarjetaBtc.innerHTML = '<div class="moneda">₿ Bitcoin (BTC)</div><div class="tasas">No disponible</div>';
  }
}

function llenarBancos() {
  const tbody = document.querySelector('#seccion-bancos tbody');
  tbody.innerHTML = '';
  bancosExtranjero.forEach((b) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td>${banderaPais(b.pais)}${b.pais}</td><td>${b.banco}</td>`;
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
      mostrarConfirmacion('Depósito agregado correctamente.');
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
