console.log("APP JS CARGADO");

const basePath = "canciones/";
let archivos = [];

// INICIALIZAR
async function init() {
  console.log("INIT EJECUTANDO");

  try {
    const res = await fetch(basePath + "index.json");

    if (!res.ok) {
      throw new Error("No se pudo cargar index.json: " + res.status);
    }

    archivos = await res.json();

    console.log("Archivos cargados:", archivos);

    archivos.sort();

    cargarIndice();

  } catch (err) {
    console.error("ERROR INIT:", err);
    document.getElementById("indice").innerHTML =
      "❌ Error cargando canciones";
  }
}

init();


// CARGAR ÍNDICE
async function cargarIndice() {
  const idioma = document.getElementById("idioma").value;
  const indice = document.getElementById("indice");

  indice.innerHTML = "";

  for (let file of archivos) {
    try {
      const res = await fetch(basePath + file);
      const data = await res.json();

      if (data.idiomas[idioma]) {
        let li = document.createElement("li");

        li.innerText = data.idiomas[idioma].titulo;
        li.onclick = () => mostrarCancion(data);

        indice.appendChild(li);
      }

    } catch (e) {
      console.error("Error en canción:", file, e);
    }
  }
}


// MOSTRAR CANCIÓN
function mostrarCancion(data) {
  const idioma = document.getElementById("idioma").value;
  const cont = document.getElementById("contenido");

  let html = "";

  html += `<h2>${data.idiomas[idioma].titulo}</h2>`;
  html += `<a href="${data.idiomas[idioma].audio}" target="_blank">🎵 Escuchar</a><br><br>`;

  html += `<div>`;
  for (let lang in data.idiomas) {
    html += `<button onclick="cambiarIdioma('${lang}', '${data.id}')">${bandera(lang)}</button>`;
  }
  html += `</div><br>`;

  html += `<pre>${data.idiomas[idioma].letra}</pre>`;

  cont.innerHTML = html;
}


// CAMBIAR IDIOMA
async function cambiarIdioma(lang, id) {
  const res = await fetch(`${basePath}${id}.json`);
  const data = await res.json();

  document.getElementById("idioma").value = lang;
  mostrarCancion(data);
}


// BANDERAS
function bandera(lang) {
  const flags = {
    es: "🇦🇷",
    it: "🇮🇹",
    pt: "🇧🇷",
    en: "🇬🇧"
  };
  return flags[lang] || lang;
}
