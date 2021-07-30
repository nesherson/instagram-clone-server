import User from './userModel';

async function create(values) {
  const user = await User.create(values);
  return user;
}

async function findAll(values) {
  const users = await User.findAll(values);
  return users;
}

async function findById(values) {
  const user = await User.findByPk(values);
  return user;
}

async function findOne(values) {
  const user = await User.findOne(values);
  return user;
}

export { create, findAll, findById, findOne };

export default { create, findAll, findById, findOne };
