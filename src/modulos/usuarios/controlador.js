const db = require('../../DB/mysql');
const bcrypt = require('bcrypt');
const config = require('../../config');
const jwt = require('jsonwebtoken');

const TABLA = 'usuarios';
const COLUMNAID = 'idUsuario';

function todos() {
    return db.todos(TABLA);
}

function uno(id) {
    return db.uno(TABLA, COLUMNAID, id);
}

function nicks() {
    return db.column(TABLA, 'Usuario');
}

async function agregar(body) {
    console.log(body);

    if (body.Contrasena) {
        body.Contrasena = await bcrypt.hash(body.Contrasena.toString(), 5); // Aumenté el número de rondas a 5
    }

    return db.agregar(TABLA, COLUMNAID, body);
}

function eliminar(body) {
    return db.eliminar(TABLA, COLUMNAID, body);
}

async function login(body) {
    const data = await db.queryFlex(TABLA, { Usuario: body.Usuario, Activo: 1 });

    if (data[0] === undefined || !(await bcrypt.compare(body.Contrasena, data[0].Contrasena))) {
        return {
            token: null
        };
    }

    const token = jwt.sign({ user: data[0].Usuario }, config.jwt.secret, { expiresIn: '1d' });

    const datosUsuario = await db.query(TABLA, { Usuario: body.Usuario });
    const idRol = datosUsuario[0].idRol;
    const permisos = await db.query("roles_has_permisos", { Roles_idRol: idRol });

    const arrayPermisos = []
    let nombrePermiso

    for (permiso of permisos) {
        nombrePermiso = await db.query("permisos", { idPermiso: permiso.Permisos_idPermiso })
        console.log(nombrePermiso[0].Permiso)
        arrayPermisos.push(nombrePermiso[0].Permiso)
    }

    return {
        token: token,
        permisos: arrayPermisos
    };
}

async function consultarPermisos(body) {
    const datosUsuario = await db.query(TABLA, { Usuario: body.Usuario });
    const idRol = datosUsuario[0].idRol;
    const permisos = await db.query("roles_has_permisos", { Roles_idRol: idRol });

    const arrayPermisos = []
    let nombrePermiso

    for (permiso of permisos) {
        nombrePermiso = await db.query("permisos", { idPermiso: permiso.Permisos_idPermiso })
        console.log(nombrePermiso[0].Permiso)
        arrayPermisos.push(nombrePermiso[0].Permiso)
    }

    return {
        permisos: arrayPermisos
    };
}

async function obtenerUsuarioDesdeToken(token) {
    try {
        const tokenWithoutBearer = extractTokenWithoutBearerPrefix(token);
        const decoded = jwt.verify(tokenWithoutBearer, config.jwt.secret);
        return decoded.user;
    } catch (error) {
        throw new Error('Token inválido');
    }
}

function extractTokenWithoutBearerPrefix(token) {
    if (token && token.startsWith('Bearer ')) {
        return token.slice(7);
    }
    return token;
}

async function permisos(req) {
    try {
        const token = req.headers['authorization']; // Accede al token de autorización desde el encabezado
        const tokenWithoutBearer = extractTokenWithoutBearerPrefix(token); // Elimina el prefijo 'Bearer ' del token
        console.log(tokenWithoutBearer);
        const usuario = await obtenerUsuarioDesdeToken(tokenWithoutBearer);
        const datosUsuario = await db.query(TABLA, { Usuario: usuario });
        console.log(datosUsuario[0]);
        console.log(datosUsuario[0].idRol);
        const idRol = datosUsuario[0].idRol;
        const permisos = await db.query("roles_has_permisos", { Roles_idRol: idRol });
        console.log(permisos)

        switch (req.body.Interfaz) {
            case "login":
                return true;
            case "home":
                return true;
            case "roles":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 1) { // Verifica el ID del permiso
                        return true;
                    }
                }
                break;
            case "permisos":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 2) { 
                        return true;
                    }
                }
                break;
            case "usuarios":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 3) { 
                        return true;
                    }
                }
                break;
            case "agregarUsuario":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 4) { 
                        return true;
                    }
                }
                break;
            case "modificarUsuario":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 4) { 
                        return true;
                    }
                }
                break;
            case "clientes":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 5) { 
                        return true;
                    }
                }
                break;
            case "agregarCliente":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 6) { 
                        return true;
                    }
                }
                break;
            case "modificarCliente":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 6) { 
                        return true;
                    }
                }
                break;
            case "catalogo":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 7) { 
                        return true;
                    }
                }
                break;
            case "detallesPieza":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 7) { 
                        return true;
                    }
                }
                break;
            case "agregarPieza":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 8) { 
                        return true;
                    }
                }
                break;
            case "modificarPieza":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 8) { 
                        return true;
                    }
                }
                break;
            case "carrito":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 9) { 
                        return true;
                    }
                }
                break;
            case "rfq":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 10) { 
                        return true;
                    }
                }
                break;
            case "detallesRFQ":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 10) { 
                        return true;
                    }
                }
                break;
            case "agregarRFQ":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 11) { // Verifica el ID del permiso
                        return true;
                    }
                }
                break;
            case "modificarCostosRFQ":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 12) { // Verifica el ID del permiso
                        return true;
                    }
                }
                break;
            case "pedidos":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 13) { // Verifica el ID del permiso
                        return true;
                    }
                }
                break;
            case "detallesPedido":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 13) { // Verifica el ID del permiso
                        return true;
                    }
                }
                break;
            case "reportes":
                for (const permiso of permisos) {
                    if (permiso.Permisos_idPermiso === 15) { // Verifica el ID del permiso
                        return true;
                    }
                }
                break;
            default:
                break;
        }
        console.log("No hay permisos")
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function unoPorUser(user) {
    console.log(user)
    const resultado = await db.query(TABLA, user);
    return resultado[0].idRol;
}

async function idPorUser(user) {
    console.log(user)
    const resultado = await db.query(TABLA, user);
    return resultado[0].idUsuario;
}

module.exports = {
    todos,
    uno,
    unoPorUser,
    idPorUser,
    nicks,
    agregar,
    eliminar,
    login,
    consultarPermisos,
    permisos
};