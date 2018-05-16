var nodemailer = require('nodemailer');

module.exports = (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'emirpalm@gmail.com', // Cambialo por tu email
            pass: 'boryitbsckzmaczr' // Cambialo por tu password
        }
    });

    var mailOptions = {
        from: `"${formulario.nombre}" <${formulario.email}>`,
        to: 'emirpalm@gmail.com', // Cambia esta parte por el destinatario
        subject: formulario.asunto,
        html: `
        <strong>Nombre:</strong> ${formulario.nombre} <br/>
        <strong>E-mail:</strong> ${formulario.email}  <br/>
        <strong>Mensaje:</strong> ${formulario.mensaje}
        `
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });

}