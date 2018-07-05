// Requires
var express = require('express');
var Embarque = require('../models/embarque');

// Inicializar variables
var app = express();

//mostramos todos los pedimentos 
/*
app.get('/', (req, res) => {
    Embarque.getPedimentos((err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar los pedimentos',
                errores: err
            });
        }
        res.status(200).json({
            ok: true,
            data
        });
    });
});
*/
//obtiene un embarque por su idcliente
app.get('/', (req, res) => {
    //id del usuario
    var id = req.query.id.split(',');
    var fechactual = req.query.fechactual;
    fechactual = Date.now(fechactual);
    var desde = req.query.desde || 0;
    desde = Number(desde);

    //solo actualizamos si la id es un número
    Embarque.getEmbarqueId(id, fechactual, desde, (err, embarques) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar embarque',
                errores: err
            });
        }
        //si el pedimento existe lo mostramos en formato json
        if (typeof embarques !== 'undefined' && embarques.length > 0) {
            res.status(200).json({
                ok: true,
                embarques
            });
        } else {
            return res.status(400).json({
                ok: false,
                mensaje: 'El embarque con el id ' + id + ' no existe',
                errores: { message: 'No existe un embarque con ese ID' }
            });
        }
    });


});

//obtiene un pedimentos por su idPedimento
app.post('/', (req, res) => {
    //creamos un objeto con los datos a buscar del embarque
    var embarqueData = {
        idPatente: req.body.idPatente,
        fIni: req.body.fIni,
        fFin: req.body.fFin,
        idSeccion: req.body.IdSeccion,
        idCliente: req.body.idCliente,
        importExport: req.body.importExport,
        pedimento: req.body.pedimento,
        contenedor: req.body.contenedor,
        guia: req.body.guia,
        viaje: req.body.viaje
    };
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Embarque.getEmbarque(embarqueData, desde, (err, embarques) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar pedimento',
                errores: err
            });
        }
        //si el pedimento existe lo mostramos en formato json
        if (typeof embarques !== 'undefined' && embarques.length > 0) {
            res.status(200).json({
                ok: true,
                embarques,
                total: embarques.length
            });
        } else {
            return res.status(400).json({
                ok: false,
                mensaje: 'El pedimento con el id ' + embarqueData.idPatente + ' no existe',
                errores: { message: 'No existe un pedimento con ese ID' }
            });
        }
    });


});

// export
module.exports = app;