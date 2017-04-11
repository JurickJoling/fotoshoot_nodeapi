var port = process.env.PORT || 3030
var pkg = require('../package.json')

// console.log(process.env);
// console.log(process); 
console.log(`fotoshoot.api ${pkg.version}`)
console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

app = require('.');

app.listen(port, function () {
	console.log(`Running: http://localhost:${port}`)
});