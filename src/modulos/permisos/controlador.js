const db = require('../../DB/mysql');

const tabla = 'permisos';

function todos(){

    return db.todos(tabla);
}

function uno(id) {
    return db.uno(tabla, COLUMNAID, id);
}

function agregar(body){
    db.agregar(tabla, COLUMNAID, body);
}

function eliminar(body) {
    return db.eliminar(tabla, COLUMNAID, body);
}

module.exports = {
    todos,uno,agregar,eliminar
}