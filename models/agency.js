'use strict';

module.exports = (sequelize, DataTypes) => {
  var Agency = sequelize.define('Agency', {
    name: {
      type: DataTypes.STRING,
      validate: {
        is: ['^[a-zA-Z0-9_ ]+$', 'i'],
        len: [1, 255]
      }
    },
    description: DataTypes.TEXT,
    grade: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 3
      }
    }
  }, {
    instanceMethods: {
      toJSON() {
        return this.get();
      }
    },
    classMethods: {
      associate: (models) => {
        Agency.belongsToMany(models.Tag, {
          through: 'AgencyTag',
          as: 'tags'
        });
      }
    }
  });
  return Agency;
};
