const db = require('../../DB/mysql');

const TABLA = 'pedidos';
const COLUMNAID = 'idPedido';
const ESTATUS = "1";
 
function todos(){
    return db.todos(TABLA);
}


function uno(id) {
    return db.uno(TABLA, COLUMNAID, id);
}

async function unoPorPedido(id) {
    console.log(id)
    return resultado = await db.query(TABLA, id);     
}

function agregar(body){
    db.agregar(TABLA, COLUMNAID, body);
}

function eliminar(body) {
    return db.eliminar(TABLA, COLUMNAID, body);
}

function consultarPorFecha(fechas) {
    return db.consultarPorFecha(fechas);
}

function consultarEstatusxFecha(fechas) {
    return db.consultarEstatusxFecha(fechas);
}

module.exports = {
    todos,
    uno,    
    unoPorPedido,
    agregar,
    eliminar,
    consultarPorFecha,
    consultarEstatusxFecha
}