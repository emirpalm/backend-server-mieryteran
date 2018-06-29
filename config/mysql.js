var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '192.168.2.205',
    port: '3307',
    user: 'root',
    password: 'fmat*0348',
    database: 'myt'
});

// Evento en case de error
connection.on('error', (err) => {
    console.log(err.code);
});

// Exportar la variable como modulo
exports.connection = connection;

// Comprobar conexion
exports.connect = () => {
    connection.connect((err) => {
        if (!err) {
            console.log('Base de datos MySQL: \x1b[32m%s\x1b[0m', 'online');
            return true;
        } else {
            console.log("MySQL-> %s", err);
            return err;
        }
    });
}