const { Router } = require('express');
const { fileUpload, retornaImagen } = require('../controllers/upload.controllers');
const expressFile = require('express-fileupload');

const { validarJwt } = require('../middleware/validar-jwt');

const router = Router();

router.use(expressFile());
router.put('/:tipo/:id', validarJwt, fileUpload);
router.get('/:tipo/:foto', retornaImagen);


module.exports = router;