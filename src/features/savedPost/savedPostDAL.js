import SavedPost from './savedPostModel';

async function create(values) {
    const savedPost = await SavedPost.create(values);
    return savedPost;
  }
  
  async function findAll(values) {
    const savedPosts = await SavedPost.findAll(values);
    return savedPosts;
  }
  
  async function findById(values) {
    const savedPost = await SavedPost.findByPk(values);
    return savedPost;
  }

  async function remove(values) {
    await SavedPost.destroy(values);
  }
  
  export { create, findAll, findById, remove };
  
  export default { create, findAll, findById, remove };
  