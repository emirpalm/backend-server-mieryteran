// Requires
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Boletin = require('../models/boletin');

// =======================================
// Obtener Boletin
// =======================================
app.get('/', (req, res, netx) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Boletin.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, boletines) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando boletines'
                    });
                }
                Boletin.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        boletines,
                        total: conteo
                    });

                })

            })
});




// =======================================
// Actualizar Boletin
// =======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Boletin.findById(id, (err, boletin) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar boletin',
                errores: err
            });
        }

        if (!boletin) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El boletin con el id ' + id + ' no existe',
                errores: { message: 'No existe un boletin con ese ID' }
            });
        }

        boletin.titulo = body.titulo;
        boletin.descripcion = body.descripcion;
        boletin.usuario = req.usuario._id;


        boletin.save((err, boletinGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar boletin',
                    errores: err
                });
            }


            res.status(200).json({
                ok: true,
                boletin: boletinGuardado
            });
        });

    });

});



// =======================================
// Crear Boletin
// =======================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var boletin = new Boletin({
        titulo: body.titulo,
        descripcion: body.descripcion,
        usuario: req.usuario._id

    });

    boletin.save((err, boletinGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear boletin',
                errores: err
            });
        }
        res.status(201).json({
            ok: true,
            boletin: boletinGuardado
        });

    });

});

// =======================================
// Borrar Boletin por id
// =======================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Boletin.findByIdAndRemove(id, (err, boletinBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar boletin',
                errores: err
            });
        }

        if (!boletinBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un boletin con ese id',
                errores: { message: 'No existe un boletin con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            boletin: boletinBorrado
        });
    });
});

// export
module.exports = app;