// Requires
var express = require('express');
var Boletin = require('../models/boletin');
var Usuario = require('../models/usuario');

// Inicializar variables
var app = express();

// =======================================
// Busqueda por Collection
// =======================================
app.get('/collection/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'boletines':
            promesa = buscarBoletines(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: Usuarios y Boletines',
                error: { message: 'Tipo de tabla/collection no válido' }
            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});

// =======================================
// Fin Busqueda por Collection
// =======================================

// =======================================
// Busqueda general
// =======================================
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

// =======================================
// Fin Busqueda general
// =======================================

// Export
module.exports = app;