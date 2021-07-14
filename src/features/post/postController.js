import postDAL from './postDAL';
import User from '../user/userModel';
import CommentDAL from '../comment/commentDAL';

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

async function getPosts(req, res, next) {
  try {
    const posts = await postDAL.findAll({
      include: [{ model: User, attributes: ['username', 'profileImg'] }],
    });

    const response = {
      posts: [...posts],
      msg: 'Returned posts successfully ',
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function addComment(req, res) {
  try {
    const { commentText } = req.body;
    const postId = req.params.id;
    console.log('commentText: ', commentText);

    const values = {
      postId: postId,
      text: commentText,
    };

    const comment = await CommentDAL.create(values);

    const response = {
      id: comment.id,
      text: comment.text,
      postId: comment.postId,
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

export { addPost, getPosts, addComment };
export default { addPost, getPosts, addComment };
