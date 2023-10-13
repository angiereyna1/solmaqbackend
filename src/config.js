// Este archivo contiene todas las variables globales del sistema
require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 4000,
    },
    jwt:{
        secret: process.env.SECRET || 'notaSecreta!'
    },
    mysql: {
        host: process.env.MYSQL_HOST || '127.0.0.1',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'its0803',
        database: process.env.MYSQL_DB || 'solmaqweb'
    }
}