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

// Encuentra por id
function uno(tabla, COLUMNAID, idRol){
    return new Promise((resolve, reject)=>{
        conexion.query(`SELECT * FROM ${tabla} WHERE ${COLUMNAID} = ${idRol}`, (error, result)=>{
            if (error) return reject(error);

            if (result.length > 0) {
                resolve(result[0]);
            } else {
                reject(new Error('No se encontró ningún registro con el ID proporcionado.'));
            }
        });
    });
}

// Insertar Rol
function insertar(tabla, data){
    return new Promise((resolve, reject)=>{
        conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, result)=>{
            return error ? reject(error) : resolve(result);
        });
    });
}

// Modificar Rol
function modificar(tabla, COLUMNAID, data){
    return new Promise((resolve, reject)=>{
        conexion.query(`UPDATE ${tabla} SET ? WHERE ${COLUMNAID} = ?`, [data, data.idRol], (error, result)=>{
            return error ? reject(error) : resolve(result);
        });
    });
}

// Agregar un Rol (modificar - insertar)
function agregar(tabla, COLUMNAID, data){
    if(data && data.idRol == 0){
        return insertar(tabla, data);
    }else{
        return modificar(tabla, COLUMNAID, data);
    }
}

// Elimina un rol
function eliminar(tabla, COLUMNAID, data){
    return new Promise((resolve, reject)=>{
        conexion.query(`DELETE FROM ${tabla} WHERE ${COLUMNAID} = ?`, data.idRol, (error, result)=>{
            return error ? reject(error) : resolve(result);
        });
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
    agregar,
    eliminar,
    query,
    queryFlex    
}