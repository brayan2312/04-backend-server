const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario.models");
const { generarJwt } = require("../helpers/jwt");


const getUsuarios = async (req = request, resp = response) => {
  const desde = Number(req.query.desde) || 0;

  // const usuarios = await Usuario.find({}, "nombre email google")
  //                               .skip(desde)
  //                               .limit(5);

  const [usuarios, total] = await Promise.all([
     Usuario.find({}, "nombre email google role google img")
                                .skip(desde)
                                .limit(5),
    Usuario.countDocuments()
  ])

  resp.json({
    ok: true,
    usuarios,
    total
  });
};

const crearUsuario = async (req = request, res = response) => {
  const { nombre, password, email } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail)
      return res.status(400).json({ ok: false, msg: "El correo ya existe" });

    const usuario = new Usuario(req.body);

    // Encriptar
    const salt = bcrypt.genSaltSync();

    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    const token = await generarJwt(usuario.id);


    return res.json({
      ok: true,
      token,
      usuario,
      msg: "Creando....",
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ ok: false, msg: "Error en el server" });
  }
};

const actualizarUsuario = async (req = request, res = response) => {
  const { id } = req.params;
  const { nombre, password, role } = req.body;

  try {
    const usuarioDB = await Usuario.findById(id);

    if (!usuarioDB)
      return res
        .status(404)
        .json({ ok: false, msg: "No existe un usuario por ese id" });

    const { password, google, email, ...campos } = req.body;
    // Actualizaciones
    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email: email });
      if (existeEmail)
        return res
          .status(404)
          .json({ ok: false, msg: "Ya existe un usuario con el email" });
    }

     if(!usuarioDB.google) {
       campos.email = email;
     }else if(usuarioDB.email !== email) {
        return res
            .status(404)
            .json({ ok: false, msg: "Usuario de google no puede cambiar su correo" });
     }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, campos, {
      new: true,
    });

    return res.json({
      ok: true,
      msg: "update....",
      id,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ ok: false, msg: "Error en el server" });
  }
};

const eliminarUsuario = async (req = request, res = response) => {

  const { id } = req.params;

  try {

    const usuarioDB = await Usuario.findById(id);

    if (!usuarioDB)
      return res.status(404).json({ ok: false, msg: "No existe un usuario por ese id" });

    await Usuario.findByIdAndDelete(id);


    return res.json({
      ok: true,
      msg: "Usuario Eliminado...",
    });
  } catch (error) {

    console.log(error);
    return res.status(500).json({ ok: false, msg: "Error en el server" });

  }
};
module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
