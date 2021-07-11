import postDAL from './postDAL';

async function addPost(req, res) {
  try {
    const { imageUrl, caption } = req.body;

    const values = {
      imageUrl: imageUrl,
      caption: caption,
      likes: 0,
      userId: req.userData.id,
    };

    const post = await postDAL.create(values);

    const response = {
      user: {
        id: post.userId,
      },
      post: {
        id: post.id,
      },
      msg: 'Created post.',
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}
export { addPost };
export default { addPost };
