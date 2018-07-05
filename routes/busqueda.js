// Requires
var express = require('express');
var Boletin = require('../models/boletin');
var Usuario = require('../models/usuario');
var Embarque = require('../models/embarque');

// Inicializar variables
var app = express();

// =======================================
// Busqueda por Collection
// =======================================
app.get('/collection/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regexp = new RegExp(busqueda, 'i');
    var desde = req.query.desde || 0;
    desde = Number(desde);

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regexp);
            break;
        case 'boletines':
            promesa = buscarBoletines(busqueda, regexp);
            break;
        case 'embarques':
            promesa = buscarEmbarques(busqueda, desde);
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
    var regexp = new RegExp(busqueda, 'i');

    Promise.all([
            buscarBoletines(busqueda, regexp),
            buscarUsuarios(busqueda, regexp)
        ])
        .then(respuesta => {
            res.status(200).json({
                ok: true,
                boletines: respuesta[0],
                usuarios: respuesta[1]

            });
        });


});


function buscarBoletines(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Boletin.find({ titulo: regexp })
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

function buscarUsuarios(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'img nombre email role')
            .or([{ 'nombre': regexp }, { 'email': regexp }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(usuarios)
                }
            });

    });

}

function buscarEmbarques(busqueda, desde) {

    return new Promise((resolve, reject) => {

        Embarque.getEmbarqueREGEXP(busqueda, desde, (err, data) => {
            if (err) {
                reject('Error al cargar embarques', err)
            } else {
                resolve(data)
            }
        });
    });

}

// =======================================
// Fin Busqueda general
// =======================================

// Export
module.exports = app;