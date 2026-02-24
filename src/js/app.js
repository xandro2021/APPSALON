let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

document.addEventListener('DOMContentLoaded', () => iniciarApp());

function iniciarApp() {
  mostrarSeccion();
  // Cambia la seccion cuando se presionen los tabs
  tabs();
  // Agrega o quita los botones del paginador
  botonesPaginador();

  paginaSiguiente();
  paginaAnterior();
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
  }
  else {
    paginaSiguiente.classList.remove('ocultar');
    paginaAnterior.classList.remove('ocultar');
  }

  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector('#anterior');

  paginaAnterior.addEventListener('click', function() {
    if (paso <= pasoInicial) return;

    paso--;
    botonesPaginador();
  });
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector('#siguiente');

  paginaSiguiente.addEventListener('click', function() {
    if (paso >= pasoFinal) return;

    paso++;
    botonesPaginador();
  });

}
