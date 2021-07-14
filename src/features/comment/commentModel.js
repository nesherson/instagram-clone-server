import { DataTypes } from 'sequelize';

import sequelize from '../../db';

const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Comment;
