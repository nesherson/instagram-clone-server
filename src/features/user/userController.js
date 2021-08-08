import Post from "../post/postModel";

import postDAL from "../post/postDAL";
import commentDAL from "../comment/commentDAL";
import userDAL from "./userDAL";
import savedPostDAL from "../savedPost/savedPostDAL";
import postLikeDAL from "../postLike/postLikeDAL";

async function getAuthUser(req, res) {
  try {

    const userId = req.userData.id;

    const user = await userDAL.findOne({
      where: { id: userId},
      attributes: { exclude: ["password"] },
    });

    console.log(user);

    const response = {
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        profileImg: user.profileImg,
      },
      message: 'Auth user returned successfully.'
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: error.message });
  }
}

async function getUserByUsername(req, res) {
  try {

    const username = req.params.id;
    
    const user = await userDAL.findOne({
      where: { username: username },
      attributes: { exclude: ["password"] },
    });

    const response = {
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        profileImg: user.profileImg,
      },
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

export { getAuthUser, getUserByUsername };

export default { getAuthUser, getUserByUsername };
