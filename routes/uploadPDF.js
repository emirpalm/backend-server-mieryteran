// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');


// Inicializar variables
var app = express();

// Models
var Boletin = require('../models/boletin');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección
    var tiposValidos = ['boletines'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar un PDF' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.pdf;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['pdf'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }


        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });


    })



});



function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'boletines') {

        Boletin.findById(id, (err, boletin) => {

            if (!boletin) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Boletin no existe',
                    errors: { message: 'Boletin no existe' }
                });
            }


            var pathViejo = './uploads/boletines/' + boletin.pdf;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            boletin.pdf = nombreArchivo;

            boletin.save((err, boletinActualizado) => {

                boletinActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'PDF de boletin actualizada',
                    boletin: boletinActualizado
                });

            })


        });

    }



}



module.exports = app;