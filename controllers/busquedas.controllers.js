const { request, response} = require('express');
const Usuario = require('../models/usuario.models');
const Medico = require('../models/medico.models');
const Hospital = require('../models/hospital.models');

const getBusquedadTodo = async(req = request, res = response) => {
    const { busqueda } = req.params;
    const regex = new RegExp(busqueda, 'i');
    console.log("hola");
    // const usuarios = 
    // const medicos =  
    // const hospital = 

    const [usuarios, medicos, hospital] = await Promise.all([
         Usuario.find({ nombre: regex }),
         Medico.find({ nombre: regex }),
         Hospital.find({ nombre: regex }),
    ])
    


    res.json({
        ok: true,
        busqueda,
        usuarios,
        medicos,
        hospital
    })
}

const getDocumentoColeccion = async(req = request, res = response) => {
    const busqueda = req.params.busqueda;
    const tabla  = req.params.tabla;
    console.log(busqueda, tabla);

    const regex = new RegExp(busqueda, 'i');
    let data = [];
    switch(tabla){
        case 'medicos':
             data = await Medico.find({nombre: regex })
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img');
        break;

        case 'hospitales':
             data = await Hospital.find({nombre: regex })
                                    .populate('usuario', 'nombre img');
        break;

        case 'usuarios':
             data = await Usuario.find({nombre: regex });

        break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'Tabla incorrecta'
            })
    }

     res.json({
        ok: false,
        resultados: data
    })

}

module.exports = {
    getBusquedadTodo,
    getDocumentoColeccion,
}