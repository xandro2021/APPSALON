let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  id: '',
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
}

document.addEventListener('DOMContentLoaded', () => iniciarApp());

function iniciarApp() {
  mostrarSeccion();
  // Cambia la seccion cuando se presionen los tabs
  tabs();
  // Agrega o quita los botones del paginador
  botonesPaginador();

  paginaSiguiente();
  paginaAnterior();

  // Carga los servicios desde la API
  consultarAPI();
  // Carga los respectivos datos en el objeto cita
  idCliente();
  nombreCliente();
  seleccionarFecha();
  seleccionarHora();

  // Muestra el Resumen de la cita
  mostrarResumen();
}

function mostrarSeccion() {
  // Ocultar la seccion que tenga la clase de mostrar
  const seccionAnterior = document.querySelector('.mostrar');

  if (seccionAnterior) {
    seccionAnterior.classList.remove('mostrar');
  }

  // Seleccionar la seccion usando el paso
  const seccion = document.querySelector(`#paso-${paso}`);
  seccion.classList.add('mostrar');

  // Quitar clase actual al tab anterior
  const tabAnterior = document.querySelector('.actual');

  if (tabAnterior) {
    tabAnterior.classList.remove('actual');
  }

  // Resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add('actual');
}

function tabs() {
  const botones = document.querySelectorAll('.tabs button');

  botones.forEach(boton => {

    boton.addEventListener('click', e => {
      paso = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      botonesPaginador();
    });

  });
}

function botonesPaginador() {
  const paginaSiguiente = document.querySelector('#siguiente');
  const paginaAnterior = document.querySelector('#anterior');

  if (paso === 1) {
    paginaSiguiente.classList.remove('ocultar');
    paginaAnterior.classList.add('ocultar');
  }
  else if (paso === 3) {
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.add('ocultar');
    mostrarResumen();
  }
  else {
    paginaSiguiente.classList.remove('ocultar');
    paginaAnterior.classList.remove('ocultar');
  }

  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector('#anterior');

  paginaAnterior.addEventListener('click', function () {
    if (paso <= pasoInicial) return;

    paso--;
    botonesPaginador();
  });
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector('#siguiente');

  paginaSiguiente.addEventListener('click', function () {
    if (paso >= pasoFinal) return;

    paso++;
    botonesPaginador();
  });

}

async function consultarAPI() {
  try {

    const url = "http://localhost:3000/api/servicios";
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    mostrarServicios(servicios);

  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach(servicio => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement('P');
    nombreServicio.classList.add('nombre-servicio');
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement('P');
    precioServicio.classList.add('precio-servicio');
    precioServicio.textContent = `$${precio}`;

    const servicioDiv = document.createElement('DIV');
    servicioDiv.classList.add('servicio');
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = () => seleccionarServicio(servicio);

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector('#servicios').appendChild(servicioDiv);

  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;

  if (servicios.some(agregado => agregado.id === id)) {
    // Eliminarlo
    cita.servicios = servicios.filter(agregado => agregado.id !== id);
  }
  else {
    // Agregarlo
    cita.servicios = [...servicios, servicio];
  }

  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
  divServicio.classList.toggle('seleccionado');
}


function idCliente() {
  cita.id = document.querySelector('#id').value;
}

function nombreCliente() {
  cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector('#fecha');
  inputFecha.addEventListener('input', e => {

    const dia = new Date(e.target.value).getUTCDay();

    if ([0, 6].includes(dia)) {
      e.target.value = '';
      mostrarAlerta('error', 'Fines de semana no permitidos', '.formulario');
    }
    else {
      cita.fecha = e.target.value;
    }

  });
}

function seleccionarHora() {
  const inputHora = document.querySelector('#hora');

  inputHora.addEventListener('input', e => {
    const horaCita = e.target.value;
    const hora = horaCita.split(':')[0];

    if (hora < 10 || hora > 18) {
      mostrarAlerta('error', 'El horario de antencion es de 10 am a 06 pm', '.formulario');
    }
    else {
      // Horario valido
      cita.hora = e.target.value;
    }
  });

}

function mostrarAlerta(tipo, mensaje, elemento, desaparece = true) {
  // Previene que se genere mas de una alerta
  const alertaPrevia = document.querySelector('.alerta');
  if (alertaPrevia) alertaPrevia.remove();

  // Crear alerta
  const alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  // Eliminar alerta
  if (desaparece) {
    setTimeout(() => alerta.remove(), 3000);
  }
}


function mostrarResumen() {
  const resumen = document.querySelector('.contenido-resumen');

  // Limpiar el contenido de resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes('') || cita.servicios.length === 0) {
    mostrarAlerta('error', 'Hacen falta datos de servicios, fecha u hora', '.contenido-resumen', false);
    return;
  }

  const { nombre, fecha, hora, servicios } = cita;

  // Heading para servicios en resumen
  const headingServicios = document.createElement('H3');
  headingServicios.textContent = 'Resumen de Servicios';
  resumen.appendChild(headingServicios);

  // Iterando y mostrando los servicios
  servicios.forEach(servicio => {
    const { id, precio, nombre } = servicio;

    const contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicio');

    const textoServicio = document.createElement('P');
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement('P');
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.append(textoServicio, precioServicio);

    resumen.appendChild(contenedorServicio);
  });

  // Heading para cita en resumen
  const headingCita = document.createElement('H3');
  headingCita.textContent = 'Resumen de Cita';
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement('P');
  nombreCliente.innerHTML = `<span>Nombre: </span> ${nombre}`;

  // Formatear la fecha
  const [year, mes, dia] = fecha.split('-').map(Number);

  const fechaUTC = new Date(year, mes - 1, dia);

  const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fechaCliente = document.createElement('P');
  fechaCliente.innerHTML = `<span>Fecha: </span> ${fechaFormateada}`;

  const horaCita = document.createElement('P');
  horaCita.innerHTML = `<span>Hora: </span> ${hora}`;

  // Boton para crear una cita
  const botonReservar = document.createElement('BUTTON');
  botonReservar.classList.add('boton');
  botonReservar.textContent = "Reservar Cita";
  botonReservar.onclick = reservarCita;

  resumen.append(nombreCliente, fechaCliente, horaCita, botonReservar);
}

async function reservarCita() {
  // Enviar datos al servidor por medio de javascript
  const { id, fecha, hora, servicios } = cita;

  const idServicios = servicios.map(servicio => servicio.id);

  const datos = new FormData();
  datos.append('usuarioId', id);
  datos.append('fecha', fecha);
  datos.append('hora', hora);
  datos.append('servicios', idServicios);
  // console.log([...datos]);

  try {
    // Peticion hacia la API
    const url = "http://localhost:3000/api/citas";

    const respuesta = await fetch(url, {
      method: 'POST',
      body: datos
    });

    const resultado = await respuesta.json();

    if (resultado.resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada correctamente",
        footer: '',
        button: 'OK'
      }).then(() => setTimeout(() => window.location.reload(), 1000));
    }

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la cita",
    });
  }
}
