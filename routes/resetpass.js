// Requires
var express = require('express');

// Inicializar variables
var app = express();

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    Usuario = require('../models/usuario'),
    path = require('path'),
    async = require('async'),
    crypto = require('crypto'),
    _ = require('lodash'),
    hbs = require('nodemailer-express-handlebars'),
    email = process.env.MAILER_EMAIL_ID || 'emirpalm@gmail.com',
    pass = process.env.MAILER_PASSWORD || 'boryitbsckzmaczr',
    nodemailer = require('nodemailer');


var smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    auth: {
        user: email,
        pass: pass
    }
});


var handlebarsOptions = {
    viewEngine: 'handlebars',
    viewPath: path.resolve('./templates/'),
    extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));


// Rutas
app.get('/', (req, res) => {
    return res.sendFile(path.resolve('./public/reset-password.html'));
});

app.post('/', (req, res) => {
    Usuario.findOne({
        reset_password_token: req.body.token
    }).exec(function(err, user) {
        if (!err && user) {
            if (req.body.newPassword === req.body.verifyPassword) {
                user.password = bcrypt.hashSync(req.body.newPassword, 10);
                user.reset_password_token = undefined;
                user.reset_password_expires = undefined;
                user.save(function(err) {
                    if (err) {
                        return res.status(422).send({
                            message: err
                        });
                    } else {
                        var data = {
                            to: user.email,
                            from: email,
                            template: 'reset-password-email',
                            subject: 'Password Reset Confirmation',
                            context: {
                                name: user.nombre.split(' ')[0]
                            }
                        };

                        smtpTransport.sendMail(data, function(err) {
                            if (!err) {
                                return res.json({ message: 'Password reset' });
                            } else {
                                return done(err);
                            }
                        });
                    }
                });
            } else {
                return res.status(422).send({
                    message: 'Passwords do not match'
                });
            }
        } else {
            return res.status(400).send({
                message: 'Password reset token is invalid or has expired.'
            });
        }
    });
});

// export
module.exports = app;