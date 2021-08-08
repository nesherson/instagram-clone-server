import User from "../user/userModel";
import PostLike from "../postLike/postLikeModel";
import Comment from "../comment/commentModel";
import Post from '../post/postModel';

import postDAL from "./postDAL";
import savedPostDAL from "../savedPost/savedPostDAL";
import commentDAL from "../comment/commentDAL";
import postLikeDAL from "../postLike/postLikeDAL";

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
      message: "Created a post.",
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

async function getPosts(req, res) {
  try {
    const posts = await postDAL.findAll({
      include: [
        { model: User, attributes: ["id", "username", "profileImg"] },
        { model: PostLike, attributes: ["id", "userId", "postId"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    });

    const updatedPosts = posts.map((post) => {
      const postComments = post.comments.map((comment) => {
        return {
          id: comment.id,
          text: comment.text,
          username: comment.user.username,
        };
      });

      return {
        id: post.id,
        imageUrl: post.imageUrl,
        caption: post.caption,
        user: {
          id: post.user.id,
          username: post.user.username,
          profileImg: post.user.profileImg,
        },
        likes: post.postLikes,
        comments: postComments,
      };
    });

    const response = {
      posts: updatedPosts,
      message: "Posts returned successfully.",
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

async function getPost(req, res) {
  try {
    const postId = req.params.id;

    const post = await postDAL.findOne({
      where: { id: postId },
      include: [{ model: User, attributes: ["username", "profileImg"] }],
    });

    const comments = await commentDAL.findAll({
      where: { postId: postId },
      include: [{ model: User, attributes: ["username"] }],
    });

    const updatedComments = comments.map((comment) => {
      return {
        id: comment.id,
        text: comment.text,
        username: comment.user.username,
      };
    });

    const likes = await postLikeDAL.findAll({ where: { postId: postId } });

    const updatedPost = {
      id: post.id,
      imageUrl: post.imageUrl,
      caption: post.caption,
      likes: likes,
      comments: updatedComments,
      user: {
        id: post.userId,
        username: post.user.username,
        profileImg: post.user.profileImg,
      },
    };

    const response = {
      post: updatedPost,
      message: "Post returned successfully.",
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

async function getUserPosts(req, res) {
  try {
    const userId = req.params.id;


    
    const posts = await postDAL.findAll({
      where: { userId: userId },
    });
    
    const postsLikes = await postLikeDAL.findAll();
    const postsComments = await commentDAL.findAll();

    const updatedPosts = posts.map((post) => {
      const postLikes = postsLikes.filter(
        (like) => like.postId === post.id
      );
      const postComments = postsComments.filter(
        (comment) => comment.postId === post.id
      );

      return {
        id: post.id,
        imageUrl: post.imageUrl,
        likes_count: postLikes.length,
        comments_count: postComments.length
      };
    });
    

    const response = {
      posts: updatedPosts,
      message: "User posts returned successfully.",
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

async function addComment(req, res) {
  try {
    const { newComment } = req.body;
    const postId = parseInt(req.params.id);
    const userId = req.userData.id;

    const values = {
      postId: postId,
      text: newComment,
      userId: userId,
    };

    const comment = await commentDAL.create(values);

    const response = {
      id: comment.id,
      text: comment.text,
      postId: postId,
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

async function getComments(req, res) {
  try {
    const comments = await commentDAL.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });

    const updatedComments = comments.map((comment) => {
      return {
        id: comment.id,
        text: comment.text,
        postId: comment.postId,
        user: {
          username: comment.user.username,
        },
      };
    });

    const response = {
      comments: updatedComments,
      message: "Comments returned successfully ",
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

async function getPostComments(req, res) {
  try {
    const postId = parseInt(req.params.id);

    const comments = await commentDAL.findAll({
      where: {
        postId: postId,
      },
      include: [{ model: User, attributes: ["username"] }],
    });

    const updatedComments = comments.map((comment) => {
      return {
        id: comment.id,
        text: comment.text,
        username: comment.user.username,
      };
    });

    const response = {
      postId: postId,
      comments: updatedComments,
      message: "Post comments returned successfully ",
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

async function likePost(req, res) {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.userData.id;
    const likedPosts = await postLikeDAL.findAll({ where: { userId: userId } });

    let likedPost = likedPosts.find(
      (likedPost) => likedPost.dataValues.postId === postId
    );

    if (!likedPost) {
      const values = {
        postId: postId,
        userId: userId,
      };

      likedPost = await postLikeDAL.create(values);

      const response = {
        id: likedPost.id,
        postId: likedPost.postId,
        userId: likedPost.userId,
        message: "Post liked.",
      };

      res.status(200).send(response);
    } else {
      await postLikeDAL.remove({
        where: {
          postId: postId,
          userId: userId,
        },
      });

      const response = {
        postId: postId,
        userId: userId,
        message: "Post disliked",
      };

      res.status(200).send(response);
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

async function getLikes(req, res) {
  try {
    const likes = await postLikeDAL.findAll();

    const response = {
      likes: likes,
      message: "Likes returned successfully.",
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

async function getPostLikes(req, res, next) {
  try {
    const postId = parseInt(req.params.id);

    const likes = await postLikeDAL.findAll({
      where: {
        postId: postId,
      },
    });

    const response = {
      postId: postId,
      likes: likes,
      message: "Post comments returned successfully ",
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
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
        message: "Post saved.",
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
        message: "Post removed from saved posts.",
      };
      res.status(200).send(response);
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
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
          imageUrl: savedPost.post.imageUrl,
          likes_count: savedPostLikes.length,
          comments_count: savedPostComments.length,
        },
      };
    });

    const response = {
      savedPosts: updatedSavedPosts,
      message: "Saved posts returned successfully.",
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export {
  addPost,
  getPosts,
  getPost,
  getUserPosts,
  addComment,
  getComments,
  getPostComments,
  likePost,
  getLikes,
  getPostLikes,
  savePost,
  getSavedPosts,
};
export default {
  addPost,
  getPosts,
  getPost,
  getUserPosts,
  addComment,
  getComments,
  getPostComments,
  likePost,
  getLikes,
  getPostLikes,
  savePost,
  getSavedPosts,
};
