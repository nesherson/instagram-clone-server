import Comment from './commentModel';

async function create(values) {
  const comment = await Comment.create(values);
  return comment;
}

async function findAll(values) {
  const comments = await Comment.findAll(values);
  return comments;
}

export { create, findAll };

export default { create, findAll };
