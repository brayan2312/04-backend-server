const { validationResult  } = require('express-validator'); 
const { request, response } = require('express')


const validarCampos = (req = request, res = response, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return  res.status(400).json({ ok: false, errors: errors.array() });
    }

    next();

}


module.exports = {
    validarCampos,

}