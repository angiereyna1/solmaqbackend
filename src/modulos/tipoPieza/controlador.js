const db = require('../../DB/mysql');

const TABLA = 'tipopieza';
const COLUMNAID = 'idTipoPieza';
const ESTATUS = "1";
 
function todos(){
    return db.todos(TABLA);
}

function uno(id) {
    return db.uno(TABLA, COLUMNAID, id);
}

function agregar(body){
    db.agregar(TABLA, COLUMNAID, body);
}

function eliminar(body) {
    return db.eliminar(TABLA, COLUMNAID, body);
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar
}