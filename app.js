const basePath = "canciones/";
let archivos = [];

// =========================
// INICIALIZACIÓN
// =========================
async function init() {
  const indexRes = await fetch(basePath + "index.json");
  archivos = await indexRes.json();

  cargarIndice();
}

init();


// =========================
// CARGAR ÍNDICE
// =========================
async function cargarIndice() {
  const idioma = document.getElementById("idioma").value;
  const indice = document.getElementById("indice");

  indice.innerHTML = "";

  for (let file of archivos) {
    const res = await fetch(basePath + file);
    const data = await res.json();

    if (data.idiomas[idioma]) {
      let li = document.createElement("li");
      li.innerText = data.idiomas[idioma].titulo;

      li.onclick = () => mostrarCancion(data);

      indice.appendChild(li);
    }
  }
}


// =========================
// MOSTRAR CANCIÓN
// =========================
function mostrarCancion(data) {
  const idioma = document.getElementById("idioma").value;
  const cont = document.getElementById("contenido");

  let html = "";

  html += `<h2>${data.idiomas[idioma].titulo}</h2>`;
  html += `<a href="${data.idiomas[idioma].audio}" target="_blank">🎵 Escuchar</a><br><br>`;

  // botones de idioma
  html += `<div>`;
  for (let lang in data.idiomas) {
    html += `<button onclick="cambiarIdioma('${lang}', '${data.id}')">
              ${bandera(lang)}
            </button>`;
  }
  html += `</div><br>`;

  // letra
  html += `<pre>${data.idiomas[idioma].letra}</pre>`;

  cont.innerHTML = html;
}


// =========================
// CAMBIAR IDIOMA
// =========================
async function cambiarIdioma(lang, id) {
  const res = await fetch(`${basePath}${id}.json`);
  const data = await res.json();

  document.getElementById("idioma").value = lang;
  mostrarCancion(data);
}


// =========================
// BANDERAS
// =========================
function bandera(lang) {
  const flags = {
    es: "🇦🇷",
    it: "🇮🇹",
    pt: "🇧🇷",
    en: "🇬🇧"
  };

  return flags[lang] || lang;
}


// =========================
// ACORDES (base lógica)
// =========================
function parseChordLine(line) {
  let regex = /\[([A-G#m7]+)\]/g;

  let chords = [];
  let match;

  while ((match = regex.exec(line)) !== null) {
    chords.push({ pos: match.index, chord: match[1] });
  }

  let cleanLyrics = line.replace(regex, "");

  let chordLine = "";

  chords.forEach(c => {
    while (chordLine.length < c.pos) chordLine += " ";
    chordLine += c.chord;
  });

  return {
    chords: chordLine,
    lyrics: cleanLyrics
  };
}
