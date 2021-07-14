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
    const userId = req.userData.id;

    const values = {
      postId: postId,
      text: commentText,
      userId: userId,
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

async function getComments(req, res) {
  try {
    const comments = await CommentDAL.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });

    const response = {
      comments: comments,
      msg: 'Returned comments successfully ',
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function likePost(req, res) {
  try {
    const postId = req.params.id;

    const post = await postDAL.findById(postId);

    post.likes += 1;

    await post.save();

    const response = {
      post: {
        id: post.id,
        likes: post.likes,
      },
      msg: 'Post liked.',
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

export { addPost, getPosts, addComment, getComments, likePost };
export default { addPost, getPosts, addComment, getComments, likePost };
