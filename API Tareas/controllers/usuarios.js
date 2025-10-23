import fs from "fs";

const rutaUsuarios = "./models/usuarios.json";

function leerUsuarios() {
  const data = fs.readFileSync(rutaUsuarios, "utf8");
  return JSON.parse(data);
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(rutaUsuarios, JSON.stringify(usuarios, null, 2));
}

const rutaNotas = "./models/notas.json";

function leerNotas() {
  const data = fs.readFileSync(rutaNotas, "utf8");
  return JSON.parse(data);
}

function guardarNotas(notas) {
  fs.writeFileSync(rutaNotas, JSON.stringify(notas, null, 2));
}

export function agregarusuario(req, res) {
  const { identificacion, nombre } = req.body;

  if (!identificacion || !nombre) {
    return res.status(400).json({ msg: "Faltan datos por registrar" });
  }

  const usuarios = leerUsuarios();
  const id = identificacion.trim().toLowerCase();

  const existeusuario = usuarios.some(
    (usuario) =>
      usuario.identificacion &&
      usuario.identificacion.trim().toLowerCase() === id
  );

  if (existeusuario) {
    return res.status(400).json({
      msg: "Ya existe un usuario con ese número de identificación",
    });
  }

  const nuevousuario = { identificacion, nombre };
  usuarios.push(nuevousuario);
  guardarUsuarios(usuarios);

  res.json({
    msg: "Usuario creado exitosamente",
    usuario: nuevousuario,
    totaldeusuarios: usuarios.length,
  });
}

export function obtenerusuarios(req, res) {
  const usuarios = leerUsuarios();
  res.json({
    msg: "Todas las listas registradas",
    usuarios,
    totaldeusuarios: usuarios.length,
  });
}

export function eliminarusuario(req, res) {
  const { identificacion } = req.params;
  const eliminarnotas = req.query.eliminarnotas == "true";

  console.log("Identificación recibida para eliminar:", identificacion);

  if (!identificacion) {
    return res
      .status(400)
      .json({ msg: "Por favor registra la identificacion correcta" });
  }

  const usuarios = leerUsuarios();

  const idusuario = usuarios.findIndex(
    (id) =>
      id.identificacion.trim().toLowerCase() ===
      identificacion.trim().toLowerCase()
  );

  if (idusuario === -1) {
    return res.status(404).json({
      msg: "No se encontro el usuario por esa identificacion, verifica",
    });
  }

  let notasaeliminar = 0;
  if (eliminarnotas) {
    const listadenotas = leerNotas();
    const notasfiltradas = listadenotas.filter(
      (nota) =>
        nota.idusuario.trim().toLowerCase() !==
        identificacion.trim().toLowerCase()
    );

    notasaeliminar = listadenotas.length - notasfiltradas.length;
    guardarNotas(notasfiltradas);
  }

  const eliminarusuario = usuarios.splice(idusuario, 1)[0];

  guardarUsuarios(usuarios);

  res.json({
    msg: eliminarnotas
      ? `Usuario eliminado correctamente. También se eliminaron ${notasaeliminar} nota(s) relacionadas.`
      : "Usuario eliminado correctamente. Las notas relacionadas no fueron eliminadas.",
    tarea: eliminarusuario,
    totaldetareas: usuarios.length,
  });
}
