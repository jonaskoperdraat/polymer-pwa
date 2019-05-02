'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const yaml = require('js-yaml');
const fs   = require('fs');

const secret = 'jwt-secret';
const jwtOptions = {
    expiresIn: 600 // Seconds
};

let users = [];
// Get document, or throw exception on error
try {
    users = yaml.safeLoad(fs.readFileSync('api/users.yml', 'utf8'));
} catch (e) {
    console.log('Unable to read file with user info', e);
    process.exit(1);
}

const app = express();

express.json();

app.get('/', (req, res) => {
    res
        .status(200)
        .send('Up and running!')
        .end();
});

app.get('/auth/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    var user = users[username];
    if (user && user.password === password) {
        // Successful login
        const payload = { username: username };
        sendToken(res, payload);
    } else {
        // Unauthorized
        res.status(401)
            .end();
    }
});

app.get('/auth/refresh', (req, res) => {
    const jwtPayload = verifyJwtToken(req, res);
    if (!jwtPayload) {
        return;
    }

    sendToken(res, jwtPayload);
});

app.get('/users/own', (req, res) => {
    const jwtPayload = verifyJwtToken(req, res);
    if (!jwtPayload) {
        return
    }

    const username = jwtPayload.username;
    if (!username) {
       Console.log('received JWT token that\'s missing \'username\'');
       return res.status(401)
           .send('Missing data in JWT token');
   }

   const user = users[username];
   const response = {
       firstName: user.firstName,
       lastName: user.lastName
   };

    return res.status(200)
        .send(response)
        .end();
});

// Start the server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

/**
 * Send a response containing a JWT token with the given payload
 * @param res
 * @param payload
 */
function sendToken(res, payload) {
    console.log('creating jwt token, payload: ', payload);
    const token = jwt.sign(payload, secret, jwtOptions);
    console.log('token', token);

    res.status(200)
        .send(token)
        .end();
}

/**
 * Verifies the jwtToken, responding with errors when appropriate and returning
 * the JWT payload when successful.
 * @param req
 * @param res
 * @returns {payload|{}}
 */
function verifyJwtToken(req, res) {
    // Get token from header
    const regex = /^bearer (.*)/i;
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401)
            .send('Missing \'Authorization\' header');
        return;
    }
    const match = authHeader.match(regex);
    if (!match) {
        res.status(401)
            .send('No or incorrect Authorization header. Should be \'Bearer <token>\'');
        return;
    }
    const token = match[1];
    console.log('token', token);

    let jwtPayload;
    try {
        jwtPayload = jwt.verify(token, secret);

    } catch (e) {
        res.status(401)
            .send('Unable to verify JWT token (' + e.message + ')');
        return;
    }
    console.log('decoded payload', jwtPayload);

    return jwtPayload;
}