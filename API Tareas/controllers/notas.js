import fs from "fs";

const rutaNotas = "./models/notas.json";
const rutaUsuarios = "./models/usuarios.json";

function leerNotas() {
  const data = fs.readFileSync(rutaNotas, "utf8");
  return JSON.parse(data);
}

function guardarNotas(notas) {
  fs.writeFileSync(rutaNotas, JSON.stringify(notas, null, 2));
}

function leerUsuarios() {
  const datausuarios = fs.readFileSync(rutaUsuarios, "utf8");
  return JSON.parse(datausuarios);
}

export function agregarnota(req, res) {
  const { nombre, descripcion, estado, idusuario } = req.body;

  if (!nombre || !descripcion || !estado || !idusuario) {
    return res.status(400).json({ msg: "Faltan datos por registrar" });
  }

  const datausuarios = leerUsuarios();

  if (estado !== "PENDIENTE" && estado !== "COMPLETADA") {
    return res
      .status(400)
      .json({ msg: "Los estados permitidos son PENDIENTE o COMPLETADA" });
  }

  const listado = leerNotas();

  const verificarnombre = listado.some(
    (nota) => nota.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (verificarnombre) {
    return res.status(400).json({ msg: "Ya existe una nota con ese nombre" });
  }

  if (!datausuarios.some((item) => item.identificacion === idusuario)) {
    return res.status(400).json({
      msg: "El usuario no esta registrado. Debe registrase antes de crear una nota",
    });
  }

  const nuevaTarea = { nombre, descripcion, estado, idusuario };

  listado.push(nuevaTarea);

  guardarNotas(listado);

  res.json({
    msg: "Nota creada exitosamente",
    tarea: nuevaTarea,
    totaldetareas: listado.length,
  });
}

export function obtenertodas(req, res) {
  const listado = leerNotas();
  res.json({
    msg: "Todas las listas registradas",
    listado,
  });
}

export function obtenerpornombre(req, res) {
  const { nombre } = req.query;

  if (!nombre) {
    return res.status(400).json({ msg: "Falta el parámetro 'nombre'" });
  }

  const listado = leerNotas();
  const tarea = listado.find((n) => n.nombre === nombre);

  if (!tarea) {
    return res
      .status(404)
      .json({ msg: "No se encontró ninguna tarea con ese nombre" });
  }

  res.json({
    msg: "Se encontró la tarea por el nombre",
    tarea,
  });
}

export function obtenerporestado(req, res) {
  const { estado } = req.query;

  if (!estado) {
    return res.status(400).json({ msg: "Falta el parámetro del estado" });
  }

  const listado = leerNotas();
  const tareasFiltradas = listado.filter(
    (n) => n.estado === estado.toUpperCase()
  );

  if (!tareasFiltradas.length) {
    return res.status(404).json({
      msg: `No se encontró ninguna tarea con estado ${estado.toUpperCase()}`,
    });
  }

  res.json({
    msg: `Se encontró la tarea(s) por estado ${estado.toUpperCase()}`,
    tareas: tareasFiltradas,
  });
}

export function modificardescripcion(req, res) {
  const { nombre } = req.params;
  const { descripcion } = req.body;

  if (!descripcion) {
    return res.status(400).json({ msg: "Debes proporcionar una descripción" });
  }

  const listado = leerNotas();

  const index = listado.findIndex(
    (nota) => nota.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ msg: "Nota no encontrada" });
  }

  listado[index].descripcion = descripcion;

  guardarNotas(listado);

  res.json({
    msg: "Descripción actualizada con éxito",
    nota: listado[index],
  });
}

export function modificarestado(req, res) {
  const { nombre } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ msg: "Debes proporcionar un estado" });
  }

  if (estado !== "PENDIENTE" && estado !== "COMPLETADA") {
    return res.status(400).json({
      msg: "Los estados válidos son PENDIENTE o COMPLETADA",
    });
  }

  const listado = leerNotas();

  const index = listado.findIndex(
    (nota) => nota.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ msg: "Nota no encontrada" });
  }

  listado[index].estado = estado;

  guardarNotas(listado);

  res.json({
    msg: "Estado actualizado con éxito",
    nota: listado[index],
  });
}

export function eliminarnota(req, res) {
  const { nombre } = req.params;

  if (!nombre) {
    return res
      .status(400)
      .json({ msg: "Por favor registra el nombre de la nota" });
  }

  const listado = leerNotas();

  const idnombre = listado.findIndex(
    (nota) => nota.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (idnombre === -1) {
    return res
      .status()
      .json({ msg: "No se encontro la tarea por ese nombre, verifica" });
  }

  const eliminartarea = listado.splice(idnombre, 1)[0];

  guardarNotas(listado);

  res.json({
    msg: "Tarea fue eliminada correctamente",
    tarea: eliminartarea,
    totaldetareas: listado.length,
  });
}

export function obtenernotasporusuario(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "Debe proporcionar un ID de usuario" });
  }

  const usuarios = leerUsuarios();
  const notas = leerNotas();

  const usuarioExiste = usuarios.find(
    (usuario) =>
      usuario.identificacion &&
      usuario.identificacion.trim().toLowerCase() === id.trim().toLowerCase()
  );

  if (!usuarioExiste) {
    return res.status(404).json({ msg: "Usuario no encontrado" });
  }

  const notasDelUsuario = notas.filter(
    (nota) =>
      nota.idusuario &&
      nota.idusuario.trim().toLowerCase() === id.trim().toLowerCase()
  );

  res.json({
    msg: `Notas del usuario ${usuarioExiste.nombre}`,
    usuario: usuarioExiste,
    totaldenotas: notasDelUsuario.length,
    notas: notasDelUsuario,
  });
}


/************** IA ***************/
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function obtenerRespuesta(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error al consultar Gemini:", error);
    return "Ocurrió un error al interpretar la nota.";
  }
}

export async function interpretarnota(req, res) {
  const { nombre } = req.params;

  if (!nombre) {
    return res.status(400).json({ msg: "Debe enviar el nombre de la nota" });
  }

  const notas = leerNotas();

  const notaEncontrada = notas.find(
    (nota) => nota.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  if (!notaEncontrada) {
    return res
      .status(404)
      .json({ msg: `No se encontró nota con nombre: ${nombre}` });
  }

  const prompt = `
  A continuación te presento una descripción escrita por un usuario sobre una actividad o nota:

  "${notaEncontrada.descripcion}"

  Interprétala de forma clara, como si se lo explicaras a una persona que no sabe del tema.
  Define los conceptos clave, y si es necesario, proporciona contexto educativo o técnico.
  Evita ser genérico. Sé preciso y bien estructurado, pero que sea un corto que no pase de 10 reglones.
  `;

  const interpretacion = await obtenerRespuesta(prompt);

  res.json({
    msg: "Interpretación generada correctamente",
    nota: notaEncontrada.nombre,
    descripcion: notaEncontrada.descripcion,
    interpretacion,
  });
}
