const { Router } = require('express');
const { check } = require('express-validator');
const {  getMedicos, crearMedicos, actualizarMedicos, eliminarMedicos, getMedicosById } = require('../controllers/medicos.controllers');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJwt } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', validarJwt, getMedicos);

router.post('/', [
    validarJwt,
    check('nombre', 'El nombre el hospital es obligatorio').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser valido').isMongoId(),
    validarCampos,
],crearMedicos);

router.put('/:id', [validarJwt], actualizarMedicos);
router.delete('/:id', [validarJwt], eliminarMedicos);

router.get('/:id', [validarJwt], getMedicosById);

module.exports = router;