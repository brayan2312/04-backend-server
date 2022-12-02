const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const Hospital = require("../models/hospital.models");
const { generarJwt } = require("../helpers/jwt");

const getHospitales = async (req = request, res = response) => {
  try {
    const hospitales = await Hospital.find()
                                     .populate('usuario','nombre');

    return res.json({
      ok: true,
      hospitales,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: true, msg: "Hable con el administrador" });
  }
};

const crearHospitales = async (req = request, res = response) => {

  const uid = req.uid;

  const hospital = new Hospital({
    usuario: uid,
    ...req.body
  });

  try {
   const hospitalDB =  await hospital.save();

    return res.json({
      ok: true,
      hospital: hospitalDB,
      
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: true, msg: "Hable con el administrador" });
  }
};

const actualizarHospitales = async (req = request, res = response) => {
  
  try {

    const { id } = req.params;
    const { nombre } = req.body;
    const uid = req.uid;

    const hospitalDB = await Hospital.findById(id);

    if(!hospitalDB)
        return res.status(404).json({ ok: false, msg: "Hospital no encontrado" });

    const cambiosHospital = {
      ...req.body,
      usuario: uid,
    };
    
    const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});


    return res.json({
      ok: true,
      hospital: hospitalActualizado,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const eliminarHospitales = async (req = request, res = response) => {
  const { id } = req.params;

  const hospitalDB = await Hospital.findById(id);

  if(!hospitalDB)
      return res.status(404).json({ ok: false, msg: "Hospital no encontrado" });

  await Hospital.findByIdAndDelete(id);

  try {
    return res.json({
      ok: true,
      msg: "eliminar hospitales",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
  
};

module.exports = {
  getHospitales,
  crearHospitales,
  actualizarHospitales,
  eliminarHospitales,
};
