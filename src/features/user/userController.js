import Post from "../post/postModel";

import postDAL from "../post/postDAL";
import commentDAL from "../comment/commentDAL";
import userDAL from "./userDAL";
import savedPostDAL from "../savedPost/savedPostDAL";
import postLikeDAL from "../postLike/postLikeDAL";

async function getAuthUser(req, res) {
  try {
    const users = await userDAL.findAll({
      where: { id: req.userData.id },
      attributes: { exclude: ["password"] },
    });

    const user = users[0];

    const posts = await postDAL.findAll({ where: { userId: user.id } });

    const comments = await commentDAL.findAll();

    const updatedPosts = posts.map((post) => {
      const postComments = comments.filter(
        (comment) => comment.postId === post.id
      );
      return {
        id: post.id,
        imageUrl: post.imageUrl,
        caption: post.caption,
        likes: post.likes,
        createdAt: post.createdAt,
        userId: post.userId,
        comments: postComments,
      };
    });

    const response = {
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        profileImg: user.profileImg,
        posts: updatedPosts,
      },
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: error.message });
  }
}

async function getUserByUsername(req, res) {
  try {

    const username = req.params.id;
    
    const user = await userDAL.findOne({
      where: { username: username },
      attributes: { exclude: ["password"] },
    });

    const posts = await postDAL.findAll({ where: { userId: user.id } });

    const comments = await commentDAL.findAll();

    const updatedPosts = posts.map((post) => {
      const postComments = comments.filter(
        (comment) => comment.postId === post.id
      );
      return {
        id: post.id,
        imageUrl: post.imageUrl,
        caption: post.caption,
        likes: post.likes,
        createdAt: post.createdAt,
        userId: post.userId,
        comments: postComments,
      };
    });

    const response = {
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        profileImg: user.profileImg,
        posts: updatedPosts,
      },
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function savePost(req, res) {
  try {
    const { postId } = req.body;
    const userId = req.userData.id;

    const savedPosts = await savedPostDAL.findAll({
      where: { userId: userId },
    });

    let savedPost = savedPosts.find((savedPost) => savedPost.postId === postId);

    if (!savedPost) {
      const values = {
        postId: postId,
        userId: userId,
      };

      savedPost = await savedPostDAL.create(values);

      const response = {
        id: savedPost.id,
        postId: savedPost.postId,
        userId: savedPost.userId,
        msg: "Post saved.",
      };
      res.status(200).send(response);
    } else {
      await savedPostDAL.remove({
        where: {
          userId: userId,
          postId: postId,
        },
      });

      const response = {
        msg: "Post removed from saved posts.",
      };
      res.status(200).send(response);
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function getSavedPosts(req, res) {
  try {
    const userId = req.userData.id;

    const savedPosts = await savedPostDAL.findAll({
      where: { userId: userId },
      include: [{ model: Post, attributes: ["id", "imageUrl"] }],
    });

    const postsLikes = await postLikeDAL.findAll();
    const postsComments = await commentDAL.findAll();

    const updatedSavedPosts = savedPosts.map((savedPost) => {
      const savedPostLikes = postsLikes.filter(
        (like) => like.postId === savedPost.postId
      );
      const savedPostComments = postsComments.filter(
        (comment) => comment.postId === savedPost.postId
      );

      return {
        id: savedPost.id,
        post: {
          id: savedPost.post.id,
          userId: savedPost.post.userId,
          imageUrl: savedPost.post.imageUrl,
          likes: savedPostLikes,
          comments: savedPostComments,
        },
      };  
    });

    const response = {
      savedPosts: updatedSavedPosts,
      msg: "Saved posts returned successfully.",
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: error.message });
  }
}

export { getAuthUser, getUserByUsername, savePost, getSavedPosts };

export default { getAuthUser, getUserByUsername, savePost, getSavedPosts };
