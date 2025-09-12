const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventData: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });
};
