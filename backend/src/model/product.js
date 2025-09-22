const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('saturday', 'root', 'MyAdmin123', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
}); 

module.exports = sequelize;



// async function testConnection() {
// try {
//   await sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }
// }

// testConnection();


