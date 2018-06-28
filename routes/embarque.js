// Requires
var express = require('express');
var Embarque = require('../models/embarque');

// Inicializar variables
var app = express();

//mostramos todos los pedimentos 
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

//obtiene un pedimentos por su idPedimento
app.get('/:id', (req, res) => {
    //id del usuario
    var id = req.params.id;
    //solo actualizamos si la id es un número
    if (!isNaN(id)) {
        Embarque.getPedimento(id, (err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pedimento',
                    errores: err
                });
            }
            //si el pedimento existe lo mostramos en formato json
            if (typeof data !== 'undefined' && data.length > 0) {
                res.status(200).json({
                    ok: true,
                    data
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pedimento con el id ' + id + ' no existe',
                    errores: { message: 'No existe un pedimento con ese ID' }
                });
            }
        });
    }

});

//obtiene un pedimentos por su idPedimento
app.post('/', (req, res) => {
    //creamos un objeto con los datos a buscra del embarque
    var embarqueData = {
        idPatente: req.body.idPatente,
        IdSeccion: req.body.IdSeccion,
        FIni: req.body.FIni,
        FFin: req.body.FFin
    };
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Embarque.getEmbarque(embarqueData, desde, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar pedimento',
                errores: err
            });
        }
        //si el pedimento existe lo mostramos en formato json
        if (typeof data !== 'undefined' && data.length > 0) {
            res.status(200).json({
                ok: true,
                data
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