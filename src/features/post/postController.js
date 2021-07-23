import postDAL from './postDAL';
import User from '../user/userModel';
import commentDAL from '../comment/commentDAL';
import postLikeDAL from '../postLike/postLikeDAL';

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
      msg: 'Created a post.',
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
      msg: 'Posts returned successfully',
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function getPost(req, res, next) {
  try {

    const postId = req.params.id;

    const post = await postDAL.findOne({
      where: {id: postId},
      include: [{ model: User, attributes: ['username', 'profileImg']}]
    });

    const comments = await commentDAL.findAll({where: {postId: postId}});
    const likes = await postLikeDAL.findAll({where: {postId: postId}});

    const updatedPost = {
      id: post.id,
      imageUrl: post.imageUrl,
      caption: post.caption,
      likes: likes,
      comments: comments,
      user: {
        id: post.userId,
        username: post.user.username,
        profileImg: post.user.profileImg
      }
    };

    const response = {
      post: updatedPost,
      msg: 'Post returned successfully.'
    };

    res.status(200).send(response);

  } catch(err) {
    res.status(400).send({msg: err.message})
  };
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

    const comment = await commentDAL.create(values);

    const response = {
      id: comment.id,
      text: comment.text,
        
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function getComments(req, res) {
  try {
    const comments = await commentDAL.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });

    const response = {
      comments: comments,
      msg: 'Comments returned successfully ',
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function getPostComments(req, res) {
  try {
    const postId = req.params.id;

    const comments = await commentDAL.findById(postId);

    const response = {
      comments: comments,
      msg: 'Post comments returned successfully ',
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function likePost(req, res) {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.userData.id;
    const likedPosts = await postLikeDAL.findAll({ where: {userId: userId}});

    let likedPost = likedPosts.find((likedPost) => likedPost.dataValues.postId === postId);



    if (!likedPost) {
      const values = {
        postId: postId,
        userId: userId
      };

      likedPost = await postLikeDAL.create(values);

      const response = {
        id: likedPost.id,
        postId: likedPost.postId,
        userId: likedPost.userId,
        msg: 'Post liked.'
      };

      res.status(200).send(response);
    } else {
      await postLikeDAL.remove({where: {
        postId: postId,
        userId: userId
      }});

      const response = {
        msg: 'Post disliked'
      };

      res.status(200).send(response);
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function getLikes(req, res, next) {
  try {

    const likes = await postLikeDAL.findAll();

    const response = {
      likes: likes,
      msg: 'Likes returned successfully.',
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

export { addPost, getPosts, getPost, addComment, getComments, getPostComments, likePost, getLikes };
export default { addPost, getPosts, getPost, addComment, getComments, getPostComments, likePost, getLikes };
