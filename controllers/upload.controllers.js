const path = require("path");
const fs = require("fs");
const { request, response } = require("express");
const expressFile = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const fileUpload = async (req = request, res = response) => {

    const { tipo, id } =req.params;
    const tiposValidos = ['hospitales', 'medicos','usuarios'];
    if(!tiposValidos)
        return res.status(400).json({ ok: false, msg: 'No es un medico, usuario u hospital (tipo)' });
    
    // Validar existencia de un archivo
    if(!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({ ok: false, msg: 'No se cargo un archivo' });

    //  Procesar imagen 
    const file = req.files.imagen;     

    const nombreCortado = file.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];
        
    //validar extencion

    const extencionesValidas = ['png', 'jpg', 'jpeg', 'gif']

    if(!extencionesValidas.includes(extension))
        return res.status(400).json({ ok: false, msg: 'No se cargo un archivo' });
    
    //Generar el nombre del archivo    
    const nombreArchivo = `${uuidv4()}.${extension}`;

    //Path
    const path = `./uploads/${tipo}/${nombreArchivo}`;


    // Mover la imagen
    file.mv(path, (err) => {
        if(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'Error al mover la imagen' });

        }

        // Actualizar base de datos
        actualizarImagen(tipo, id,nombreArchivo);

        return res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
          });
    })

    
}

const retornaImagen = async (req = request, res = response) => {
    const { tipo, foto } =req.params;

    const pathImg =  path.join(__dirname, `../uploads/${tipo}/${foto}`); // no-img.jpg
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);

    }else {
        const pathImg =  path.join(__dirname, `../uploads/no-img.jpg`); // no-img.jpg
        res.sendFile(pathImg);

    }

}

module.exports = {
    fileUpload,
    retornaImagen,
}