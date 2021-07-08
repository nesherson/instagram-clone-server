import { Sequelize } from 'sequelize';

const { DB_PASS } = process.env;

const sequelize = new Sequelize('instagram-clone', 'root', DB_PASS, {
  dialect: 'mysql',
  host: 'localhost',
});

async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (err) {
    console.log('Unable to connect to database: ', err);
  }
}

async function sync() {
  try {
    await sequelize.sync();
    console.log('Synched successfully.');
  } catch (err) {
    console.log('Unable to sync: ', err);
  }
}

authenticate();
sync();

export { authenticate, sync };

export default sequelize;
