const http = require("http"); /* programme qui attend les requettes http et qui y répond */ 
const app = require('./app'); /* import du fichier app.js */ 

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}; /* function qui renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne */
const port = normalizePort(process.env.PORT ||'3000');
app.set('port', port); /* configuration pour dire à l'application express sur quel port elle doit tourner */

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
}; /* function qui recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;*/

const server = http.createServer(app); /* Création du server a partir du fichier app.js*/

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});


server.listen(port); /* le serveur écoute le port */ 

