var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '192.168.2.205',
    port: '3307',
    user: 'root',
    password: 'fmat*0348',
    database: 'myt'
});

var embarqueModel = {};

//obtenemos todos los pedimentos
embarqueModel.getPedimentos = (callback) => {
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
embarqueModel.getPedimento = (id, callback) => {
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

//obtenemos los pedimentos
embarqueModel.getEmbarque = (embarqueData, callback) => {
    var filtro = 'WHERE oppedimentos.IdPatente=' + connection.escape(embarqueData.idPatente) + 'AND optramites.FechaTramite>=' + connection.escape(embarqueData.FIni) + 'AND optramites.FechaTramite<=' + connection.escape(embarqueData.FFin);
    if (embarqueData.IdSeccion > 0) {
        filtro += ' AND oppedimentos.IdSeccion=' + connection.escape(embarqueData.IdSeccion);
    }
    /*if (IdCliente > 0)
        filtros += " AND oppedimentos.IdCliente = ?cliente ";
    if (ImportExport > 0)
        filtros += " AND oppedimentos.ImportExport = ?importexport ";
    if (!string.IsNullOrEmpty(Pedimento))
        filtros += " AND oppedimentos.Pedimento LIKE ?pedimento ";
    if (!string.IsNullOrEmpty(Contenedor))
        filtros += " AND opcargas.contenedor LIKE ?contenedor ";
    if (!string.IsNullOrEmpty(Guia))
        filtros += " AND opguias.guia LIKE ?guia ";
    if (!string.IsNullOrEmpty(Viaje))
        filtros += " AND opviajes.viaje LIKE ?viaje ";*/
    if (connection) {
        var sql = 'SELECT oppedimentos.IdPedimento,oppedimentos.pedimento,oppedimentos.IdPatente,agpatentes.Patente,oppedimentos.Year,' +
            '0 AS Remesa,oppedimentos.CvePedimento,agtipospedimento.TipoPedimento,agclientes.Cliente,oppedimentos.ImportExport,' +
            'opcargas.IdCarga,opcargas.TipoCarga,opguias.Guia,opcargas.contenedor,opcargas.Sello,optramites.Observaciones,' +
            'IFNULL(opviajes.viaje,null) AS Viaje,opviajes.FArribo,IFNULL(agbuques.buque,null) AS Buque,' +
            'IFNULL(opdodas.IdDoda,-1) AS IdDoda,IFNULL(opdodas.NoIntegracion,-1) AS NoIntegracion,' +
            'oppedimentos.IdSeccion,agsecciones.IdSeccion,agsecciones.CveSeccion,agsecciones.seccion,' +
            'agaduanas.IdAduana,agaduanas.cveAduana,agaduanas.aduana,null AS COVE,' +
            'IFNULL(opcargas.sello,null) AS Sello,IFNULL(opcargas.placa,null) AS Placa,' +
            'optramites.IdTramite,optramites.Observaciones,optramites.FechaTramite,' +
            'IFNULL(DATE_FORMAT(optramites.Rojo1, "%H:%i"),null) AS Rojo1,IFNULL(DATE_FORMAT(optramites.Liberado1, "%H:%i"),null) AS Liberado1,' +
            'IFNULL(DATE_FORMAT(optramites.Rojo2, "%H:%i"),null) AS Rojo2,IFNULL(DATE_FORMAT(optramites.Liberado2, "%H:%i"),null) AS Liberado2,' +
            'IFNULL(DATE_FORMAT(optramites.Liberado, "%H:%i"),null) AS Liberado,optramites.Deposito ' +
            'FROM oppedimentos INNER JOIN agpatentes ON oppedimentos.IdPatente = agpatentes.IdPatente ' +
            'INNER JOIN agsecciones ON oppedimentos.IdSeccion = agsecciones.IdSeccion ' +
            'INNER JOIN agaduanas ON agsecciones.IdAduana = agaduanas.IdAduana ' +
            'INNER JOIN agclientes ON oppedimentos.IdCliente = agclientes.IdCliente  ' +
            'INNER JOIN oppedimentocarga ON oppedimentos.IdPedimento = oppedimentocarga.IdPedimento ' +
            'INNER JOIN opcargas ON oppedimentocarga.IdCarga = opcargas.IdCarga ' +
            'INNER JOIN opguias ON opcargas.IdGuia = opguias.IdGuia ' +
            'INNER JOIN oppedimentotramite ON oppedimentotramite.IdPedimento = oppedimentos.IdPedimento ' +
            'INNER JOIN optramites ON optramites.IdTramite = oppedimentotramite.IdTramite ' +
            'INNER JOIN agtipospedimento ON agtipospedimento.IdTipoPedimento=oppedimentos.IdTipoPedimento ' +
            'LEFT JOIN opguiaviaje ON opguias.IdGuia = opguiaviaje.Idguia ' +
            'LEFT JOIN opviajes ON opguiaviaje.IdViaje = opviajes.Idviaje ' +
            'LEFT JOIN agbuques ON opviajes.IdBuque = agbuques.IdBuque ' +
            'LEFT JOIN opdodacarga ON opdodacarga.IdCarga=opcargas.IdCarga ' +
            'LEFT JOIN opdodas ON opdodas.IdDoda=opdodacarga.IdDoda ' +
            filtro +
            "UNION " +
            'SELECT oppedimentos.IdPedimento,oppedimentos.pedimento,oppedimentos.IdPatente,agpatentes.Patente,oppedimentos.Year,' +
            'IFNULL(opremesas.remesa,0) AS Remesa,oppedimentos.CvePedimento,agtipospedimento.TipoPedimento,agclientes.Cliente,oppedimentos.ImportExport,' +
            'opcargas.IdCarga,opcargas.TipoCarga,opguias.Guia,opcargas.contenedor,opcargas.Sello,optramites.Observaciones,' +
            'IFNULL(opviajes.viaje,null) AS Viaje,opviajes.FArribo,IFNULL(agbuques.buque,null) AS Buque,' +
            'IFNULL(opdodas.IdDoda,-1) AS IdDoda,IFNULL(opdodas.NoIntegracion,-1) AS NoIntegracion,' +
            'oppedimentos.IdSeccion,agsecciones.IdSeccion,agsecciones.CveSeccion,agsecciones.seccion,' +
            'agaduanas.IdAduana,agaduanas.cveAduana,agaduanas.aduana,opfacturas.cove,' +
            'IFNULL(opcargas.sello,null) AS Sello,IFNULL(opcargas.placa,null) AS Placa,' +
            'optramites.IdTramite,optramites.Observaciones,optramites.FechaTramite,' +
            'IFNULL(DATE_FORMAT(optramites.Rojo1, "%H:%i"),null) AS Rojo1,IFNULL(DATE_FORMAT(optramites.Liberado1, "%H:%i"),null) AS Liberado1,' +
            'IFNULL(DATE_FORMAT(optramites.Rojo2, "%H:%i"),null) AS Rojo2,IFNULL(DATE_FORMAT(optramites.Liberado2, "%H:%i"),null) AS Liberado2,' +
            'IFNULL(DATE_FORMAT(optramites.Liberado, "%H:%i"),null) AS Liberado,optramites.Deposito ' +
            'FROM oppedimentos INNER JOIN agpatentes ON oppedimentos.IdPatente = agpatentes.IdPatente ' +
            'INNER JOIN agsecciones ON oppedimentos.IdSeccion = agsecciones.IdSeccion ' +
            'INNER JOIN agaduanas ON agsecciones.IdAduana = agaduanas.IdAduana ' +
            'INNER JOIN agclientes ON oppedimentos.IdCliente = agclientes.IdCliente  ' +
            'INNER JOIN opRemesas ON oppedimentos.IdPedimento = opremesas.IdPedimento ' +
            'INNER JOIN opcargas ON opremesas.IdCarga = opcargas.IdCarga ' +
            'INNER JOIN opfacturas ON opremesas.IdFactura = opfacturas.IdFactura ' +
            'INNER JOIN opguias ON opcargas.IdGuia = opguias.IdGuia ' +
            'INNER JOIN opremesatramite ON opremesatramite.IdRemesa = opremesas.IdRemesa ' +
            'INNER JOIN optramites ON optramites.IdTramite = opremesatramite.IdTramite ' +
            'INNER JOIN agtipospedimento ON agtipospedimento.IdTipoPedimento=oppedimentos.IdTipoPedimento ' +
            'LEFT JOIN opguiaviaje ON opguias.IdGuia = opguiaviaje.Idguia ' +
            'LEFT JOIN opviajes ON opguiaviaje.IdViaje = opviajes.Idviaje ' +
            'LEFT JOIN agbuques ON opviajes.IdBuque = agbuques.IdBuque ' +
            'LEFT JOIN opdodacarga ON opdodacarga.IdCarga=opcargas.IdCarga ' +
            'LEFT JOIN opdodas ON opdodas.IdDoda=opdodacarga.IdDoda ' +
            filtro +
            "UNION " +
            'SELECT oppedimentos.IdPedimento,oppedimentos.pedimento,oppedimentos.IdPatente,agpatentes.Patente,oppedimentos.Year,' +
            'IFNULL(opparciales.Parcial,0) AS Remesa,oppedimentos.CvePedimento,agtipospedimento.TipoPedimento,agclientes.Cliente,oppedimentos.ImportExport,' +
            'opcargas.IdCarga,opcargas.TipoCarga,opguias.Guia,opcargas.contenedor,opcargas.Sello,optramites.Observaciones,' +
            'IFNULL(opviajes.viaje,null) AS Viaje,opviajes.FArribo,IFNULL(agbuques.buque,null) AS Buque,' +
            'IFNULL(opdodas.IdDoda,-1) AS IdDoda,IFNULL(opdodas.NoIntegracion,-1) AS NoIntegracion,' +
            'oppedimentos.IdSeccion,agsecciones.IdSeccion,agsecciones.CveSeccion,agsecciones.seccion,' +
            'agaduanas.IdAduana,agaduanas.cveAduana,agaduanas.aduana,null AS COVE,' +
            'IFNULL(opcargas.sello,null) AS Sello,IFNULL(opcargas.placa,null) AS Placa,' +
            'optramites.IdTramite,optramites.Observaciones,optramites.FechaTramite,' +
            'IFNULL(DATE_FORMAT(optramites.Rojo1, "%H:%i"),null) AS Rojo1,IFNULL(DATE_FORMAT(optramites.Liberado1, "%H:%i"),null) AS Liberado1,' +
            'IFNULL(DATE_FORMAT(optramites.Rojo2, "%H:%i"),null) AS Rojo2,IFNULL(DATE_FORMAT(optramites.Liberado2, "%H:%i"),null) AS Liberado2,' +
            'IFNULL(DATE_FORMAT(optramites.Liberado, "%H:%i"),null) AS Liberado,optramites.Deposito ' +
            'FROM oppedimentos INNER JOIN agpatentes ON oppedimentos.IdPatente = agpatentes.IdPatente ' +
            'INNER JOIN agsecciones ON oppedimentos.IdSeccion = agsecciones.IdSeccion ' +
            'INNER JOIN agaduanas ON agsecciones.IdAduana = agaduanas.IdAduana ' +
            'INNER JOIN agclientes ON oppedimentos.IdCliente = agclientes.IdCliente  ' +
            'INNER JOIN opparciales ON oppedimentos.IdPedimento = opparciales.IdPedimento ' +
            'INNER JOIN opcargas ON opparciales.IdCarga = opcargas.IdCarga ' +
            'INNER JOIN opguias ON opcargas.IdGuia = opguias.IdGuia ' +
            'INNER JOIN optramites ON optramites.IdTramite = opparciales.IdTramite ' +
            'INNER JOIN agtipospedimento ON agtipospedimento.IdTipoPedimento=oppedimentos.IdTipoPedimento ' +
            'LEFT JOIN opguiaviaje ON opguias.IdGuia = opguiaviaje.Idguia ' +
            'LEFT JOIN opviajes ON opguiaviaje.IdViaje = opviajes.Idviaje ' +
            'LEFT JOIN agbuques ON opviajes.IdBuque = agbuques.IdBuque ' +
            'LEFT JOIN opdodacarga ON opdodacarga.IdCarga=opcargas.IdCarga ' +
            'LEFT JOIN opdodas ON opdodas.IdDoda=opdodacarga.IdDoda ' +
            filtro;
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