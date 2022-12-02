const {Router} = require('express');
const { check } = require('express-validator');
const {login, googleSignIn, renewToken} = require('../controllers/auth.controllers');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJwt } = require('../middleware/validar-jwt');

const router = Router();


router.post('/', [
    check('email', 'El email es obligatorio').isEmail(), 
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos,
], login)


router.post('/google', [
    check('token', 'El token de Google es obligatorio').not().isEmpty(),
    validarCampos,
], googleSignIn)

router.get('/renew',
    validarJwt, 
    renewToken
);


module.exports = router;