import { DataTypes } from 'sequelize';

import sequelize from '../../db';

const SavedPost = sequelize.define('savedPost', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }

});

export default SavedPost;