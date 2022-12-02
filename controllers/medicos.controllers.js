const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const Medico = require("../models/medico.models");
const { generarJwt } = require("../helpers/jwt");

const getMedicos = async(req = request, res = response) => {
    const medicos = await Medico.find() 
                        .populate('usuario','nombre img')
                        .populate('hospital','nombre img')

    return res.json({
        ok: true,
        medicos
    })
}

const crearMedicos = async(req = request, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body,
    })
    try {
        const medicoDB = await medico.save();

        return res.json({
            ok: true,
            medico: medicoDB
        })
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({ ok: true, msg: "Hable con el administrador" });
    }

}

const actualizarMedicos = async(req = request, res = response) => {

    const { id } = req.params;
    const uid = req.uid;

    try {
        const medicoDB = await Medico.findById(id);
        if(!medicoDB)
            return res.status(404).json({ ok: false, msg: "Medico no encontrado" });
     
        const cambiosMedico = {
            ...req.body,
        usuario: uid,

         }

        const MedicoActualizado = await Medico.findOneAndUpdate(id, cambiosMedico, { new: true });

        return res.json({
            ok: true,
            msg: 'actualizar medicos',
            medico: MedicoActualizado,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, msg: "Hable con el administrador" });
        
    }
}

const eliminarMedicos = async(req = request, res = response) => {
    const { id } = req.params;

   try {
        const medicoDB = await Medico.findById(id);
        if(!medicoDB)
            return res.status(404).json({ ok: false, msg: "Medico no encontrado" });
        
        await Medico.findByIdAndDelete(id);

        return res.json({
            ok: true,
            msg: 'eliminar medicos'
        })
   } catch (error) {
         console.log(error);
        return res.status(500).json({ ok: false, msg: "Hable con el administrador" });
   }
}

const getMedicosById = async(req = request, res = response) => {
   try {
    const { id } = req.params;

    const medico = await Medico.findById(id) 
                        .populate('usuario','nombre img')
                        .populate('hospital','nombre img')

    return res.json({
        ok: true,
        medico
    })
   } catch (error) {
    return res.json({
        ok: false,
        msg: 'Medico no encontrado'
    })
   }
}

module.exports = {
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    eliminarMedicos,
    getMedicosById,
}