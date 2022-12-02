const { Router } = require('express');
const { getBusquedadTodo, getDocumentoColeccion } = require('../controllers/busquedas.controllers');
const { validarJwt } = require('../middleware/validar-jwt');

const router = Router();

router.get('/:busqueda',validarJwt,getBusquedadTodo);

router.get('/coleccion/:tabla/:busqueda', validarJwt, getDocumentoColeccion);


module.exports = router;