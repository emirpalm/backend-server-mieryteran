// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');


// Inicializar variables
var app = express();

app.use(cors({
    origin: 'http://localhost:4200'
}));


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar Rutas
var appRoutes = require('./routes/app');
var pdfsRoutes = require('./routes/pdfs');
var uploadPDFRoutes = require('./routes/uploadPDF');
var imagenesRoutes = require('./routes/imagenes');
var uploadRoutes = require('./routes/upload');
var busquedaRoutes = require('./routes/busqueda');
var boletinRoutes = require('./routes/boletin');
var emailRoutes = require('./routes/email');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var forgotpass = require('./routes/forgotpass');
var resetpass = require('./routes/resetpass');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/mieryteran', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
})

// Rutas
app.use('/reset_password', resetpass)
app.use('/forgot_password', forgotpass)
app.use('/pdf', pdfsRoutes)
app.use('/uploadPDF', uploadPDFRoutes)
app.use('/img', imagenesRoutes)
app.use('/upload', uploadRoutes)
app.use('/busqueda', busquedaRoutes)
app.use('/boletin', boletinRoutes)
app.use('/formulario', emailRoutes)
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})