import { DataTypes } from "sequelize";

import sequelize from "../../db";

const PostLike = sequelize.define('postLike', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

export default PostLike;