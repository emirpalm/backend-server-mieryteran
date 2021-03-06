var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boletinSchema = new Schema({
    titulo: { type: String, required: [true, 'El titulo	es	necesario'] },
    descripcion: { type: String, required: [true, 'La descripción es necesario'] },
    pdf: { type: String, required: false },
    fechapublicado: { type: Date },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'boletines' });

module.exports = mongoose.model('Boletin', boletinSchema);