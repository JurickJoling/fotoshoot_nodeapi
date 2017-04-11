'use strict';

module.exports = (err, req, res, next) => {
    let statusCode = 500;
    if (err.validationError) {
        statusCode = 400;
    }

    
    if (err.authRequired) {
        statusCode = 401;
    }
    if (err.accessDenied) {
        statusCode = 403;
    }
    if (err.notFound) {
        statusCode = 404;
    }
    const error = {
        errorMessage: err.message
    };
    if (req.headers && req.headers.requestid) { 
        error.requestId = req.headers.requestid;
    }
    if (process.env.NODE_ENV !== 'production') {
        let stack = err.stack.split('\n');
        stack.shift();
        stack = stack
            .filter(line => line.indexOf('node_modules') === -1)
            .map(line => line.trim());
        error.debug = {
            stack,
            request: {
                method: req.method,
                uri: req.originalUrl,
                body: req.body
            },
            statusCode
        };
    }
    // body-parser error
    if (err.body) {
        error.errorMessage = 'Could not parse JSON body.';
    }
    // send and log error
    res.status(statusCode).json(error);
    if (statusCode === 500) {
        console.log(error);
    }
};
