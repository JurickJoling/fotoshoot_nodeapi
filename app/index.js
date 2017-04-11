var express = require('express')
var swaggerJSDoc = require('swagger-jsdoc')
var pkg = require('../package.json')
const errorHandler = require('./lib/errorHandler')
global.Promise = require('bluebird')

var app = module.exports = express()
var isProd = process.env.NODE_ENV === 'production'

db_conn = null;

app.set('json spaces', 2)

app.use(require('./middleware'))

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.json({
    env: process.env.NODE_ENV,
    version: pkg.version
    
  })
})

// generate swagger.json
app.get('/doc/swagger.json', function (req, res) {
  res.json(swaggerJSDoc({
    swaggerDefinition: {
      info: {
        title: 'fotoshoot.com API',
        description: 'Professionals models and photographers',
        version: pkg.version
      },
      schemes: isProd ? ['https'] : ['http'],
      basePath: '/',
      consumes: ['application/json'],
      produces: ['application/json']
    },
    apis: [
      './app/models/**/*.js',
      './app/routes/**/*.js',
      './config/swaggerDoc.js'
    ]
  }))
});


app.use('/v1/admin', require('./routes/admin/_routes'));



app.use(require('./routes/_anonymRoutes'))
app.use('/v1/utils', require('./routes/utils'));
app.use('/v1/profile', require('./routes/profile'));
app.use('/v1/browse', require('./routes/browse'));
app.use('/v1/castingcalls', require('./routes/castingcalls'));

// all routes after this require an access token
// app.use(require('./lib/parseUserId'))

app.use((req,res,next) => {
  if(!req.userId) {
    var err = new Error("Access denied.");
    err.authRequired = 1;
    return errorHandler(err, req,res,next);
  }
  next();
});


// all routes after this require an access token

app.use('/v1/users', require('./routes/users'));
app.use('/v1/galleries', require('./routes/galleries'));
app.use('/v1/me', require('./routes/me'));
app.use('/v1/photos', require('./routes/photos'));
app.use('/v1/messages', require('./routes/messages'));
app.use('/v1/book', require('./routes/book'));
app.use('/v1/projects', require('./routes/projects'));



app.use('/tests', require('./routes/tests'));
// app.use(require('./routes/users'));
// app.use(require('./routes/users'));
// app.use(require('./routes/users'));

app.use(require('./lib/errorHandler'));
