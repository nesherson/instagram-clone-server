import PostLike from './postLikeModel';

async function create(values) {
    const postLike = await PostLike.create(values);
    return postLike;
  }
  
  async function findAll(values) {
    const postLikes = await PostLike.findAll(values);
    return postLikes;
  }
  
  async function findById(values) {
    const postLike = await PostLike.findByPk(values);
    return postLike;
  }

  async function remove(values) {
    await PostLike.destroy(values);
  }
  
  export { create, findAll, findById, remove };
  
  export default { create, findAll, findById, remove };
  