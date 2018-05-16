// Requires
var express = require('express');
var Boletin = require('../models/boletin');
var Usuario = require('../models/usuario');

// Inicializar variables
var app = express();

// Rutas
app.get('/todo/:busqueda', (req, res, netx) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarBoletines(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuesta => {
            res.status(200).json({
                ok: true,
                boletines: respuesta[0],
                usuarios: respuesta[1]

            });
        });


});

// =======================================
// Busqueda general
// =======================================
function buscarBoletines(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Boletin.find({ titulo: regex })
            .populate('usuario', 'nombre email')
            .exec((err, boletines) => {

                if (err) {
                    reject('Error al cargar boletines', err);
                } else {
                    resolve(boletines)
                }
            });

    });

}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(usuarios)
                }
            });

    });

}

// export
module.exports = app;