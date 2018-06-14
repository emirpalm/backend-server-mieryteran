// Requires
var express = require('express');
var Prueba = require('../models/prueba');

// Inicializar variables
var app = express();

//mostramos todos los pedimentos 
app.get("/", function(req, res) {
    Prueba.getPedimentos(function(error, data) {
        res.json(200, data);
    });
});

//obtiene un pedimentos por su idPedimento
app.get("/:id", function(req, res) {
    //id del usuario
    var id = req.params.id;
    //solo actualizamos si la id es un número
    if (!isNaN(id)) {
        Prueba.getPedimento(id, function(error, data) {
            //si el pedimento existe lo mostramos en formato json
            if (typeof data !== 'undefined' && data.length > 0) {
                res.json(200, data);
            }
            //en otro caso mostramos una respuesta conforme no existe
            else {
                res.json(404, { "msg": "notExist" });
            }
        });
    }
    //si hay algún error
    else {
        res.json(500, { "msg": "Error" });
    }
});

// export
module.exports = app;