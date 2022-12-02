const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales, crearHospitales, actualizarHospitales, eliminarHospitales, } = require('../controllers/hospitales.controllers');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJwt } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', validarJwt, getHospitales);

router.post('/', [
    validarJwt,
    check('nombre', 'El nombre el hospital es obligatorio').not().isEmpty(),
    validarCampos,
], crearHospitales);

router.put('/:id', [
    validarJwt,
    check('nombre', 'El nombre el hospital es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarHospitales);

router.delete('/:id', [
    validarJwt,
], eliminarHospitales);

module.exports = router;