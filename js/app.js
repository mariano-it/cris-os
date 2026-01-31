/*window.detectarEstado = function (texto) {
  if (!window.auraMemoria) return;

  const t = texto.toLowerCase();

  if (t.includes("cansada") || t.includes("agotada") || t.includes("estresada")) {
    window.auraMemoria.estado = "cansada";
  } else if (t.includes("bien") || t.includes("feliz") || t.includes("tranquila")) {
    window.auraMemoria.estado = "bien";
  }

  localStorage.setItem("auraMemoria", JSON.stringify(window.auraMemoria));
};
*/
/***********************
 * TAREAS – BASE SEGURA
 ***********************/

const TASKS_KEY = "once_tasks";
const AUTO_DELETE_HOURS = 8;

function getTasks() {
  return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}

function addTask({ titulo, materia, fechaEntrega }) {
  const tasks = getTasks();

  tasks.push({
    id: crypto.randomUUID(),
    titulo,
    materia,
    fechaEntrega,
    completada: false,
    completadaEn: null,
    creadaEn: new Date().toISOString()
  });

  saveTasks(tasks);
}

function cleanupTasks() {
  const now = Date.now();
  const limit = AUTO_DELETE_HOURS * 60* 60* 1000;

  const task = getTasks().filter(task => {
    if (!task.completada || !task.completadaEn) return true;

    const completaTime = new Date(task.completadaEn).getTime();
    return now - completaTime < limit;
  });

  saveTasks(task);
}

function renderTasks() {
  cleanupTasks();

  const lista = document.getElementById("listaTareas");
  if (!lista) return;

  lista.innerHTML = "";

  const now = Date.now();

  const tasks = getTasks().sort((a, b) => {
    if (a.completada !== b.completada) return a.completada - b.completada;
    return new Date(a.fechaEntrega) - new Date(b.fechaEntrega);
  });

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";

    const left = document.createElement("div");
    left.className = "task-left";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.completada;

    check.addEventListener("change", () => {
      const tasks = getTasks();
      const t = tasks.find(x => x.id === task.id);
      if (!t) return;

      t.completada = check.checked;
      t.completadaEn = check.checked ? new Date().toISOString() : null;

      saveTasks(tasks);
      renderTasks();
    });


    const info = document.createElement("div");
    info.className = "task-info";

    const titulo = document.createElement("div");
    titulo.className = "task-title";
    titulo.textContent = task.titulo;

    if (task.completada) {
      titulo.style.textDecoration = "line-through";
      titulo.style.opacity = "0.5";
    }

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.textContent = `${task.materia} · ${task.fechaEntrega}`;

    info.appendChild(titulo);
    info.appendChild(meta);

    left.appendChild(check);
    left.appendChild(info);

    card.appendChild(left);
    lista.appendChild(card);
  });
}



// TODO ABAJO DE AQU DE CODIGO
document.addEventListener("DOMContentLoaded", () => {
  const tareaInput = document.getElementById("tareaInput");
  const materiaSelect = document.getElementById("materiaSelect");
  const fechaInput = document.getElementById("fechaEntrega");
  const agregarBtn = document.getElementById("agregarTarea");

  agregarBtn.addEventListener("click", () => {
    if (!tareaInput.value.trim()) return;

    addTask({
      titulo: tareaInput.value.trim(),
      materia: materiaSelect ? materiaSelect.value : "General",
      fechaEntrega: fechaInput.value
    });

    tareaInput.value = "";
    renderTasks();

  });

  renderTasks();


function actualizarResumenTareas() {
  const tareas = getTasks();
  const pendientes = tareas.filter(t => !t.completada).length;

  const el = document.getElementById("resTareas");
  if (!el) return;

  if (pendientes === 0) {
    el.textContent = "✨ No tienes tareas pendientes";
  } else {
    el.textContent = `📌 Tareas pendientes: ${pendientes}`;
  }
}


const horario = {
  1: [ // Lunes
    { inicio: "7:00am", fin: "11:27am", materia: "Color", salon: "3229B", Edificio: "CNTRAL" },
    { inicio: "11:30am", fin: "2:27pm", materia: "Dibujo Vectorial", salon: "Animatrix", Edificio: "LIET" }
  ],
  2: [ // Martes
    { inicio: "7:00am", fin: "8:27am", materia: "H. para el emprendimiento", salon: "5121", Edificio: "5" },
    { inicio: "10:00am", fin: "11:27am", materia: "Antropologia", salon: "5129A", Edificio: "5" },
    { inicio: "11:30am", fin: "2:27pm", materia: "Fundamentos del diseño", salon: "3229C", Edificio: "CNTRAL" },
    { inicio: "2:30pm", fin: "3:27pm", materia: "Ingles Inter: B", salon: "5126", Edificio: "5" }
  ],
  3: [ // Miercoles
    { inicio: "7:00am", fin: "11:27am", materia: "Fotografia", salon: "5122", Edificio: "5" }
  ],
  4: [ // Jueves
    { inicio: "7:00am", fin: "9:57am", materia: "Dibujo Analitico", salon: "5122", Edificio: "5" },
    { inicio: "10:00am", fin: "11:27am", materia: "Antropologia", salon: "5129A", Edificio: "5" },
    { inicio: "11:30am", fin: "2:27pm", materia: "Fundamentos del diseño", salon: "3229C", Edificio: "CNTRAL" },
    { inicio: "2:30pm", fin: "3:57pm", materia: "Ingles Inter: B", salon: "5126", Edificio: "5" }
  ],
  5: [ // Viernes
    { inicio: "8:30am", fin: "11:27am", materia: "Dibujo Analitico", salon: "5121", Edificio: "5" }
  ]
};

function obtenerClaseActual() {

function horaAMinutos(hora) {
  const match = hora.match(/(\d+):(\d+)(am|pm)/i);
  if (!match) return null;

  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const periodo = match[3].toLowerCase();

  if (periodo === "pm" && h !== 12) h += 12;
  if (periodo === "am" && h === 12) h = 0;

  return h * 60 + m;
}

  const ahora = new Date();
  const dia = ahora.getDay(); // 1 = lunes
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  if (!horario[dia] || horario[dia].length === 0) {
    return "📚 Hoy no tienes clases";
  }

  for (let clase of horario[dia]) {
    const inicio = horaAMinutos(clase.inicio);
    const fin = horaAMinutos(clase.fin);

    if (inicio !== null && fin !== null &&
        minutosActuales >= inicio && minutosActuales <= fin) {
      return `📖 Ahora: ${clase.materia}
🏫 ${clase.salon}
🏢 ${clase.Edificio}`;
    }
  }

  // buscar proxima clase
  for (let clase of horario[dia]) {
    const inicio = horaAMinutos(clase.inicio);

    if (inicio !== null && minutosActuales < inicio) {
      return `⏰ Próxima: ${clase.materia} (${clase.inicio})
🏫 ${clase.salon}
🏢 ${clase.Edificio}`;
    }
  }

  return "🎉 Clases terminadas por hoy";
}

// galeria

let db;

const dbRequest = indexedDB.open("OnceOS_DB", 1);

dbRequest.onupgradeneeded = (e) => {
  db = e.target.result;

  if (!db.objectStoreNames.contains("fotos")) {
    db.createObjectStore("fotos", { keyPath: "id", autoIncrement: true });
  }

  if (!db.objectStoreNames.contains("videos")) {
    db.createObjectStore("videos", { keyPath: "id", autoIncrement: true });
  }
};

dbRequest.onsuccess = (e) => {
  db = e.target.result;
  cargarFotos(); 
  cargarVideos();
};

dbRequest.onerror = () => {
  console.error("Error al abrir IndexedDB");
};

document.getElementById("inputFotos").addEventListener("change", (e) => {
  const files = e.target.files;

  const tx = db.transaction("fotos", "readwrite");
  const store = tx.objectStore("fotos");

  for (let file of files) {
    store.add({ archivo: file });
  }

  tx.oncomplete = () => cargarFotos();
});

const btnFotos = document.querySelector('[data-type="fotos"]');
if (btnFotos) {
  btnFotos.onclick = () => abrirGaleria("galeria");
}


//galria de Fotos

function cargarFotos() {
  const grid = document.getElementById("gridFotos");
  grid.innerHTML = "";

  const tx = db.transaction("fotos", "readonly");
  const store = tx.objectStore("fotos");

  store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (!cursor) return;

    const wrapper = document.createElement("div");
    wrapper.className = "media-wrapper";

    const url = URL.createObjectURL(cursor.value.archivo);

    const img = document.createElement("img");
    img.src = url;
    img.onclick = () => abrirViewer("img", url);

    const borrar = document.createElement("button");
    borrar.textContent = "✕";
    borrar.className = "delete-btn";

    borrar.onclick = () => {
      const txDelete = db.transaction("fotos", "readwrite");
      txDelete.objectStore("fotos").delete(cursor.key);
      txDelete.oncomplete = cargarFotos;
    };

    wrapper.appendChild(borrar);
    wrapper.appendChild(img);
    grid.appendChild(wrapper);

    cursor.continue();
  };
}


 //galeria de Videos

function cargarVideos() {
  const grid = document.getElementById("gridVideos");
  if (!grid) return;

  grid.innerHTML = "";

  const tx = db.transaction("videos", "readonly");
  const store = tx.objectStore("videos");

  store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (!cursor) return;

    const wrapper = document.createElement("div");
    wrapper.className = "media-wrapper";

    const url = URL.createObjectURL(cursor.value.archivo);

    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.controls = true;

    video.onclick = () => {
      video.pause();
      video.currentTime = 0;
      abrirViewer("video", url);
    };

    const borrar = document.createElement("button");
    borrar.textContent = "✕";
    borrar.className = "delete-btn";

    borrar.onclick = () => {
      const txDelete = db.transaction("videos", "readwrite");
      txDelete.objectStore("videos").delete(cursor.key);
      txDelete.oncomplete = cargarVideos;
    };

    wrapper.appendChild(borrar);
    wrapper.appendChild(video);
    grid.appendChild(wrapper);

    cursor.continue();
  };
}

const botones = document.querySelectorAll("nav button");
const secciones = document.querySelectorAll("section");

botones.forEach(boton => {
  boton.addEventListener("click", () => {
    secciones.forEach(sec => sec.style.display = "none");

    const id = boton.dataset.section;
    const seccion = document.getElementById(id);

    if (seccion) {
      seccion.style.display = "block";
    }
  });
});

function loadSection(section) {
    if (section === "inicio") {
        content.innerHTML = `
            <h2>Inicio</h2>
            <p>Bienvenida a ONCE OS.</p>
        `;
    }

    if (section === "apuntes") {
        content.innerHTML = `
            <h2>Apuntes</h2>
            <p>Aquí podrás guardar tus notas.</p>
        `;
    }

    if (section === "tareas") {
        content.innerHTML = `
            <h2>Tareas</h2>
            <p>Organiza lo que tienes pendiente.</p>
        `;
    }

    if (section === "series") {
        content.innerHTML = `
            <h2>Series</h2>
            <p>Lleva el control de lo que ves.</p>
        `;
    }
}
// CODIGO DE APUNTES (desactivable)
const notaInput = document.getElementById("notaInput");
const guardarBtn = document.getElementById("guardarNota");
const listaNotas = document.getElementById("listaNotas");

if (notaInput && guardarBtn && listaNotas)
{

// cargar notas guardadas
let notas = JSON.parse(localStorage.getItem("notas")) || [];
mostrarNotas();

// guardar nota
guardarBtn.addEventListener("click", () => {
  const texto = notaInput.value.trim();

  if (texto === "") return;

  notas.push(texto);
  localStorage.setItem("notas", JSON.stringify(notas));

  notaInput.value = "";
  mostrarNotas();
});

// mostrar notas
function mostrarNotas() {
  listaNotas.innerHTML = "";
}
  notas.forEach((nota, index) => {
    const li = document.createElement("li");
    li.textContent = nota;
  

    // boton borrar
    const borrar = document.createElement("button");
    borrar.textContent = "✖";
    borrar.style.marginLeft = "10px";

    borrar.addEventListener("click", () => {
      notas.splice(index, 1);
      localStorage.setItem("notas", JSON.stringify(notas));
      mostrarNotas();
    });

    li.appendChild(borrar);
    listaNotas.appendChild(li);
  });
}

/*CODIGO DE BOTON DE TAREAS
const tareaInput = document.getElementById("tareaInput");
const agregarBtn = document.getElementById("agregarTarea");
const listaTareas = document.getElementById("listaTareas");

 cargar tareas Base antigua 
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
mostrarTareas();

// agregar tarea
agregarBtn.addEventListener("click", () => {
  const texto = tareaInput.value.trim();
  if (texto === "") return;

  tareas.push({ texto, completada: false });
  localStorage.setItem("tareas", JSON.stringify(tareas));

  tareaInput.value = "";
  mostrarTareas();
});

// mostrar tareas
function mostrarTareas() {
  listaTareas.innerHTML = "";

  tareas.forEach((tarea, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarea.completada;

    checkbox.addEventListener("change", () => {
      tarea.completada = checkbox.checked;
      localStorage.setItem("tareas", JSON.stringify(tareas));
    });

    const span = document.createElement("span");
    span.textContent = tarea.texto;
    span.style.marginLeft = "8px";

    if (tarea.completada) {
      span.style.textDecoration = "line-through";
    }

    checkbox.addEventListener("change", () => {
      span.style.textDecoration = checkbox.checked ? "line-through" : "none";
    });

    const borrar = document.createElement("button");
    borrar.textContent = "✖";
    borrar.style.marginLeft = "10px";

    borrar.addEventListener("click", () => {
      tareas.splice(index, 1);
      localStorage.setItem("tareas", JSON.stringify(tareas));
      mostrarTareas();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(borrar);
    listaTareas.appendChild(li);
  });
}

*/

// CODIGO DE SERIES
const serieInput = document.getElementById("serieInput");
const estadoSerie = document.getElementById("estadoSerie");
const agregarSerieBtn = document.getElementById("agregarSerie");
const listaSeries = document.getElementById("listaSeries");

/*   Cargar series
let series = JSON.parse(localStorage.getItem("series")) || [];
mostrarSeries();

// Agregar serie
agregarSerieBtn.addEventListener("click", () => {
  const nombre = serieInput.value.trim();
  if (nombre === "") return;

  series.push({
    nombre,
    estado: estadoSerie.value
  });

  localStorage.setItem("series", JSON.stringify(series));

  serieInput.value = "";
  mostrarSeries();
});

// Mostrar series
function mostrarSeries() {
  listaSeries.innerHTML = "";

  series.forEach((serie, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${serie.nombre} (${serie.estado})`;

    const cambiarEstado = document.createElement("select");
    ["viendo", "pendiente", "terminada"].forEach(estado => {
      const option = document.createElement("option");
      option.value = estado;
      option.textContent = estado;
      if (estado === serie.estado) option.selected = true;
      cambiarEstado.appendChild(option);
    });

    cambiarEstado.addEventListener("change", () => {
      serie.estado = cambiarEstado.value;
      localStorage.setItem("series", JSON.stringify(series));
      mostrarSeries();
    });

    const borrar = document.createElement("button");
    borrar.textContent = "✖";
    borrar.style.marginLeft = "10px";

    borrar.addEventListener("click", () => {
      series.splice(index, 1);
      localStorage.setItem("series", JSON.stringify(series));
      mostrarSeries();
    });

    li.appendChild(span);
    li.appendChild(cambiarEstado);
    li.appendChild(borrar);

    listaSeries.appendChild(li);
  });
}
*/


// CODIGO DE INICIO
const bienvenida = document.getElementById("bienvenida");
const resApuntes = document.getElementById("resApuntes");
/*const resTareas = document.getElementById("resTareas");*/
const resSeries = document.getElementById("resSeries");

function actualizarInicio() {
  // apuntes
  const apuntes = JSON.parse(localStorage.getItem("notas")) || [];
  if (resApuntes) {
  resApuntes.textContent = obtenerClaseActual();
}

  /* tareas
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  const pendientes = tareas.filter(t => !t.completada).length;
  resTareas.textContent = `✅ Tareas: ${pendientes} pendientes de ${tareas.length}`; */

  /*d series
  const series = JSON.parse(localStorage.getItem("series")) || [];
  const viendo = series.filter(s => s.estado === "viendo").length;
  const pendientesSeries = series.filter(s => s.estado === "pendiente").length;
  const terminadas = series.filter(s => s.estado === "terminada").length;

  resSeries.textContent =
    `🎬 Series — Viendo: ${viendo}, Pendientes: ${pendientesSeries}, Terminadas: ${terminadas}`;*/

  // bienvenida
  const hora = new Date().getHours();
  let saludo = "Bienvenida";

  if (hora < 12) saludo = "Gus morniiiiiing";
  else if (hora < 18) saludo = "Guuus afternuuuun";
  else saludo = "Guuss niiiiight";


}
// llamar al cargar la página
actualizarInicio();

// modo twicee
const themeToggle = document.getElementById("themeToggle");

// Cargar tema guardado
const temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "soft") {
  document.body.setAttribute("data-theme", "soft");
  themeToggle.textContent = "🌸";
}

// Cambiar tema
themeToggle.addEventListener("click", () => {
  const temaActual = document.body.getAttribute("data-theme");

  if (temaActual === "soft") {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("tema", "dark");
    themeToggle.textContent = "🌙";
  } else {
    document.body.setAttribute("data-theme", "soft");
    localStorage.setItem("tema", "soft");
    themeToggle.textContent = "🌸";
  }
});

// prueba //
function inicioEmocional() {
  const saludo = document.getElementById("saludo");
  const frase = document.getElementById("frase");
  const subfrase = document.getElementById("subfrase");

  const hora = new Date().getHours();

  let momento = "";
  let frases = [];

  if (hora < 12) {
    momento = "Guss morniiing";
    frases = [
      "Hoy vamos con todo cielitooo ",
      "Diseñar hoy, mañana facturar!",
      "Todo lo que haces es importante"
    ];
  } else if (hora < 19) {
    momento = "Guss afternooooon";
    frases = [
      "Ya casi Ya casi!",
      "Chi che puede chi che puedeeee",
      "Todo un paso a la ves"
    ];
  } else {
    momento = "Gusss nightttttt";
    frases = [
      "Hoy lo hiciste geniaaaal",
      "Descanca amor mio ",
      "Mañana sera otro gran dia, bechitoo"
    ];
  }

  saludo.textContent = momento;
  frase.textContent = frases[Math.floor(Math.random() * frases.length)];
  subfrase.textContent = "Once Os creado con amor, para mi amor";
}

inicioEmocional();

// Reloj
function actualizarReloj() {
  const ahora = new Date();

  // Convertir a UTC y restar 6 horas (Mérida)
  const utc = ahora.getTime() + ahora.getTimezoneOffset() * 60000;
  const merida = new Date(utc - 6 * 60 * 60 * 1000);

  let horas = merida.getHours();
  const minutos = merida.getMinutes().toString().padStart(2, "0");
  const ampm = horas >= 12 ? "PM" : "AM";

  horas = horas % 12 || 12;

  document.getElementById("hora").textContent = `${horas}:${minutos}`;
  document.getElementById("ampm").textContent = ampm;
}

setInterval(actualizarReloj, 1000);
actualizarReloj();



// Universidad

// Navegación entre secciones
document.querySelectorAll('.app-nav button, .uni-card').forEach(btn => {
  btn.addEventListener('click', () => {
    const sectionId = btn.dataset.section;
    if (!sectionId) return;

    document.querySelectorAll('main section').forEach(sec => {
      sec.style.display = 'none';
    });

    document.getElementById(sectionId).style.display = 'block';
  });
});

// Botones que abren páginas externas
document.querySelectorAll('.casillero-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.open(btn.dataset.link, '_blank')
  })
})

//Almacenamiento
const inputFotos = document.getElementById("inputFotos");
if (inputFotos) {
  inputFotos.addEventListener("change", (e) => {
    // IndexedDB aquí
  });
}

const inputVideos = document.getElementById("inputVideos");

const gridFotos = document.getElementById("gridFotos");
const gridVideos = document.getElementById("gridVideos");

// Abrir galerías

document.querySelector('[data-type="fotos"]').onclick = () => abrirGaleria("galeriaFotos");
document.querySelector('[data-type="videos"]').onclick = () => abrirGaleria("galeriaVideos");

function abrirGaleria(id) {
  ocultarTodo();
  document.getElementById(id).style.display = "block";
}

function volverAStorage() {
  ocultarTodo();
  document.getElementById("almacenamiento").style.display = "block";
}

function ocultarTodo() {
  document.querySelectorAll("section").forEach(sec => {
    sec.style.display = "none";
  });
}

// viewer

function abrirViewer(tipo, url) {
  const viewer = document.getElementById("viewer");
  const contenido = document.getElementById("viewerContenido");

  if (!viewer || !contenido) {
    console.error("Viewer o viewerContenido no existen en el DOM");
    return;
  }

  contenido.innerHTML = "";
  viewer.style.display = "flex";

  let media;

  if (tipo === "img") {
    media = document.createElement("img");
    media.src = url;
  }

  if (tipo === "video") {
    media = document.createElement("video");
    media.src = url;
    media.controls = true;
    media.autoplay = true;
  }

  contenido.appendChild(media);

  setTimeout(() => {
    if (media.requestFullscreen) {
      media.requestFullscreen().catch(() => {});
    }
  }, 100);
}


const btnCerrar = document.getElementById("cerrarViewer");

if (btnCerrar) {
  btnCerrar.onclick = () => {
    const viewer = document.getElementById("viewer");
    const contenido = document.getElementById("viewerContenido");

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    if (contenido) contenido.innerHTML = "";
    if (viewer) viewer.style.display = "none";
  };
}


if (inputVideos) {
  inputVideos.addEventListener("change", (e) => {
    const files = e.target.files;

    const tx = db.transaction("videos", "readwrite");
    const store = tx.objectStore("videos");

    for (let file of files) {
      store.add({ archivo: file });
    }

    tx.oncomplete = () => cargarVideos();
  });
}

document.querySelectorAll('.storage-card[data-section]').forEach(card => {
  card.addEventListener('click', () => {
    const sectionId = card.dataset.section;
    if (!sectionId) return;

    document.querySelectorAll('section').forEach(sec => {
      sec.style.display = 'none';
    });

    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';
  });
});

/* memoria aura 
window.auraMemoria = JSON.parse(localStorage.getItem("auraMemoria")) || {
  nombre: "señorita Cristina",
  saludoUsado: false,
  estado: "neutral"
};

localStorage.setItem("auraMemoria", JSON.stringify(auraMemoria));

// saludo aura //

function saludoAura() {
  if (!auraMemoria.nombre || auraMemoria.saludoUsado) return "";

  const variantes = [
    `Claro que sí, ${auraMemoria.nombre}. `,
    `Por supuesto, ${auraMemoria.nombre}. `,
    `Entendido, ${auraMemoria.nombre}. `
  ];

  auraMemoria.saludoUsado = true;
  localStorage.setItem("auraMemoria", JSON.stringify(auraMemoria));

  return variantes[Math.floor(Math.random() * variantes.length)];
}


// aura //
const auraInput = document.getElementById("auraInput");
const auraChat = document.getElementById("auraChat");
const auraSend = document.getElementById("auraSend");

auraSend.addEventListener("click", enviarMensajeAura);
auraInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enviarMensajeAura();
});

async function enviarMensajeAura() {
  const texto = auraInput.value.trim();
  window.detectarEstado(texto);


window.detectarEstado(texto) // ✅ ahora sí existe

  let prefijo = "";

  if (auraMemoria.estado === "cansada") {
    prefijo = "Vamos con calma 🤍 ";
  }

  if (auraMemoria.estado === "bien") {
    prefijo = "Me alegra leerte 💗 ";
  }

  // mensajes

  auraChat.innerHTML += `
    <div class="msg user"><strong>Tú:</strong> ${texto}</div>
  `;

  auraChat.scrollTop = auraChat.scrollHeight;
  auraInput.value = "";

  try {
    const res = await fetch("http://localhost:3000/aura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: texto }),
    });

    const data = await res.json();

    
  const t = texto.toLowerCase();

  if (t.includes("cansada") || t.includes("agotada") || t.includes("estresada")) {
    auraMemoria.estado = "cansada";
  } else if (t.includes("bien") || t.includes("feliz") || t.includes("tranquila")) {
    auraMemoria.estado = "bien";
  }

  localStorage.setItem("auraMemoria", JSON.stringify(auraMemoria));


    // respuesta de Aura (AQUÍ va el saludo)
    auraChat.innerHTML += `
      <div class="msg aura">
        <strong>Aura:</strong> ${saludoAura()}${prefijo}${data.respuesta}
      </div>
    `;
    auraChat.scrollTop = auraChat.scrollHeight;

  } catch {
    auraChat.innerHTML += `
      <div class="msg aura error">Aura no pudo responder 😢</div>
    `;
  }
}
*/

  console.log(getTasks());
});