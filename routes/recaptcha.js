// Requires
var express = require('express');
var rp = require('request-promise');

// Inicializar variables
var app = express();

const secret = '6LcioWgUAAAAAPMB625oImGN9Bf7ftA9oBuhAEkf';

app.get('/', (req, res) => {

    const options = {
        method: 'POST',
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        qs: {
            secret,
            response: req.query.token
        },
        json: true
    };

    rp(options)
        .then(response => res.json(response))
        .catch(() => {});

});

module.exports = app;