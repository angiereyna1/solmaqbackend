const db = require('../../DB/mysql');

const tabla = 'roles_has_permisos';

function todos(){

    return db.todos(tabla);
}

function uno(id){    
    return db.unoCompuesto(id);
}

function agregar(body) {
    return db.agregarCompuesto(tabla, body);
}

function eliminar(body){

    return db.eliminarCompuesto(tabla, body);
}

async function permisosRol(body){
    const permisos = await db.query("roles_has_permisos", { Roles_idRol: body.idRol });    
    const arrayPermisos = []
    let nombrePermiso

    for(permiso of permisos){
        nombrePermiso = await db.query("permisos", {idPermiso: permiso.Permisos_idPermiso})
        console.log(nombrePermiso[0].Permiso)
        arrayPermisos.push(nombrePermiso[0].Permiso)
    }

    return{
        permisos: arrayPermisos
    }

}

module.exports = {
    todos,uno,agregar,eliminar,permisosRol
}