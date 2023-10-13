const db = require('../../DB/mysql');

const TABLA = 'roles';

function todos(){
    return db.todos(TABLA);
}

function uno(id){
    return db.unoRol(TABLA, id);
}

function agregar(body){
    return db.agregarRol(TABLA, body);
}

function eliminar(body){
    return db.eliminarRol(TABLA, body);
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar
}