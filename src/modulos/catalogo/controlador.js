const db = require('../../DB/mysql');

const TABLA = 'catalogo';
const COLUMNAID = 'idPieza';

 
function todos(){
    return db.todos(TABLA);
}

function uno(id) {
    return db.uno(TABLA, COLUMNAID, id);
}

function guardarPieza(pieza) {
    return db.agregarPieza(pieza);
}

function piezas() {
    return db.column(TABLA, 'NoPieza');
}

module.exports = {
    todos,
    uno,
    piezas,
    guardarPieza
}