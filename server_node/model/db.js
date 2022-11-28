import { Sequelize, DataTypes } from 'sequelize';
import mysql  from 'mysql2/promise';

const configdatabase = {
    host : "localhost",
    port : "3306",
    user : "root",
    password : "123456",
    database: "hotel"
}
const { host, port, password, user , database } = configdatabase;

export const sequelize = new Sequelize(database, user, password, {
    host: host,
    port: port,
    dialect: 'mysql'
});


async function main() {

    const connection = await mysql.createConnection({ host, port, user, password});
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log('@@@@@@@@@@');
    await sequelize.sync({ force: true });
    

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


main();



