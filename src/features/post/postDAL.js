import Post from './postModel';

async function create(values) {
  const post = await Post.create(values);
  return post;
}

async function findAll(values) {
  const posts = await Post.findAll(values);
  return posts;
}

async function findById(values) {
  const post = await Post.findByPk(values);
  return post;
}

async function findOne(values) {
  const post = await Post.findOne(values);
  return post;
}

export { create, findAll, findById, findOne };

export default { create, findAll, findById, findOne };
