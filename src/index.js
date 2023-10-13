const app = require('./app');

// inicializamos nuestro servidor
app.listen(app.get('port'), () => {
    console.log("Servidor escuchando en el puerto", app.get("port"))
});