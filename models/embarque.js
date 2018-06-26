var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '192.168.2.205',
    port: '3307',
    user: 'root',
    password: 'fmat*0348',
    database: 'myt'
});

var pruebaModel = {};

//obtenemos todos los pedimentos
pruebaModel.getPedimentos = (callback) => {
    if (connection) {
        connection.query('SELECT * from myt.oppedimentos LIMIT 0, 10', (error, rows) => {
            if (error) {
                throw error;
            } else {
                callback(null, rows);
            }
        });
    }
}

//obtenemos un pedimento por su id
pruebaModel.getPedimento = (id, callback) => {
    if (connection) {
        var sql = 'SELECT * from myt.oppedimentos WHERE IdPedimento = ' + connection.escape(id);
        connection.query(sql, (error, row) => {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
        });
    }
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = embarqueModel;