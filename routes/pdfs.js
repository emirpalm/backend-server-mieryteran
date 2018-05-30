// Requires
var express = require('express');

// Inicializar variables
var app = express();

var path = require('path');
var fs = require('fs');

// Rutas
app.get('/:tipo/:pdf', (req, res, netx) => {

    var tipo = req.params.tipo;
    var pdf = req.params.pdf;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${pdf}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImagen);
    }
});

// export
module.exports = app;