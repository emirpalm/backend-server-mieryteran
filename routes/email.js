// Requires
var express = require('express');
var configMensaje = require('../config/configMensaje');

// Inicializar variables
var app = express();

// =======================================
// Enviar Email
// =======================================

app.post('/', (req, res) => {
    configMensaje(req.body);
    res.status(200).json({
        ok: true,
        message: 'Correo enviado'
    });

})

// export
module.exports = app;