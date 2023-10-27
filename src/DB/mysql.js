const mysql = require('mysql2');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let conexion;

function conMysql(){
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) =>{
        if(err){
            console.log('[db err]', err);
            setTimeout(conMysql, 200);
        }else{
            console.log('DB Conectada!!!')
        }
    });

    conexion.on('error', err =>{
        console.log('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conMysql();        
        }else{
            throw err;
        }
    })
}

conMysql();

// Encuentra todos 
function todos(tabla){
    return new Promise((resolve, reject)=>{
        conexion.query(`SELECT * FROM ${tabla}`, (error, result)=>{
            return error ? reject(error) : resolve(result);
        })
    });
}

// Encuentra uno
function uno(tabla, COLUMNAID, id){
    return new Promise((resolve, reject)=>{
        conexion.query(`SELECT * FROM ${tabla} WHERE ${COLUMNAID} = ${id}`, (error, result)=>{
            if (error) return reject(error);

            if (result.length > 0) {
                resolve(result[0]);
            } else {
                reject(new Error('No se encontró ningún registro con el ID proporcionado.'));
            }
        });
    });
}

function unoCompuesto(id){
    return  new Promise((resolve, reject)=>{
        conexion.query(`select idRol, Rol, idPermiso, Permiso from roles,permisos, roles_has_permisos where Roles_idRol=${id} and Roles_idRol=idRol and Permisos_idPermiso = idPermiso;`, (error,result)=>{
            return error ? reject(error) : resolve(result);
        })
    });

}

// Insertar
function insertar(tabla, data){
    return new Promise((resolve, reject)=>{
        conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, result)=>{
            return error ? reject(error) : resolve(result);
        });
    });
}

// Modificar
function modificar(tabla, COLUMNAID, data){
    let id = Object.values(data);
    return new Promise((resolve, reject)=>{
        conexion.query(`UPDATE ${tabla} SET ? WHERE ${COLUMNAID} = ?`, [data, id[0]], (error, result)=>{
            return error ? reject(error) : resolve(result);
        });
    });
}

// Agregar (modificar - insertar)
function agregar(tabla, COLUMNAID, data){
    let id = Object.values(data);
    if(data && id[0] == 0){
        return insertar(tabla, data);
    }else{
        return modificar(tabla, COLUMNAID, data);
    }
}

function agregarCompuesto(tabla, data){
    return  new Promise((resolve, reject)=>{
        conexion.query(`INSERT INTO ${tabla} SET ?`,data, (error,result)=>{
            return error ? reject(error) : resolve(result);
        })
    });

}


// Elimina
function eliminar(tabla, COLUMNAID, data){
    let id = Object.values(data);
    return new Promise((resolve, reject)=>{
        conexion.query(`DELETE FROM ${tabla} WHERE ${COLUMNAID} = ?`, id[0], (error, result)=>{
            return error ? reject(error) : resolve(result);
        });
    });
}

function eliminarCompuesto(tabla, id){
   
    return  new Promise((resolve, reject)=>{
        conexion.query(`DELETE FROM ${tabla} WHERE Permisos_idPermiso=${id}`, (error,result)=>{
            return error ? reject(error) : resolve(result);
        })
    });

}

function queryFlex(tabla, consulta){

    let query=`SELECT * FROM ${tabla}`;
    let count=0;
    const tamanio = Object.keys(consulta).length;
    const valores = Object.values(consulta);
    console.log(valores)
    for (const key in consulta) {
        if (consulta.hasOwnProperty(key)) {
            count++;
            if (count>1) {
                count==tamanio ? query+=` AND ${key} = ?;` : query+=` AND ${key} = ?` 
            }else{
                query+=` WHERE ${key} = ?`
            }
        }
    }
    console.log(query)
    console.log(valores)
    return  new Promise((resolve, reject)=>{
        conexion.query(query, valores,(error,result)=>{
            return error ? reject(error) : resolve(result);
        })
    });
   
}

function query(tabla, consulta){
    return  new Promise((resolve, reject)=>{
        conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta,(error,result)=>{
            return error ? reject(error) : resolve(result);
        })
    });
}

module.exports = {
    todos,
    uno,    
    unoCompuesto,
    agregar,
    agregarCompuesto,
    eliminar,
    eliminarCompuesto,
    query,
    queryFlex    
}