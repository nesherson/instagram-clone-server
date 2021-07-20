import postDAL from "../post/postDAL";
import commentDAL from "../comment/commentDAL";
import userDAL from "./userDAL";
import savedPostDAL from "../savedPost/savedPostDAL";

async function getUser(req, res) {
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

  res.send(response);
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

export { getUser, savePost };

export default { getUser, savePost };
