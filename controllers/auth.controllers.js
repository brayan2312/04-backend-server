
const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario.models");
const { generarJwt } = require("../helpers/jwt");
const { googleverify } = require("../helpers/google-verify");

const login = async(req = request, res = response) => {
    const { email, password } = req.body
   try {

    const usuarioDB = await Usuario.findOne({ email});

    //Verificar Email
    if(!usuarioDB)
         return res.status(400).json({ ok: false, msg: "Email no valido" });

    // Verificar contaseña
    const valiPassword = bcrypt.compareSync(password, usuarioDB.password);

    if(!valiPassword)
         return res.status(400).json({ ok: false, msg: "Contraseña no valida" });


    // Generar token
    const token = await generarJwt(usuarioDB.id);


    return res.json({
        ok: true,
        msg: "login",
        token,
    })
   } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: "Hable con el administrador" });
   }
}

const googleSignIn = async(req = request, res = response) => {

    try {
        const {email, name, picture} = await googleverify(req.body.token);

        const usuarioDB = await Usuario.findOne({ email});
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@',
                img: picture,
                google: true,
            })
        }else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

         const token = await generarJwt(usuario.id);


        return res.json({ ok: true, email, name, picture, token });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ ok: true, msg: "Token de google no es correcto" });
        
    }

}

const renewToken = async(req = request, res = response) => {

    const uid = req.uid;

    const token = await generarJwt(uid);
    
    // obtener usuario por uid
    const usuario = await Usuario.findById(uid);
    console.log(uid);
    return res.json({ ok: true, token, usuario });

}
module.exports = {
    login,
    googleSignIn,
    renewToken,
}