'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {
    instanceMethods: {
      toJSON() {
        return this.get().name;
      }
    },
    classMethods: {
      associate: (models) => {
        Tag.belongsToMany(models.Agency, {
          through: 'AgencyTag',
          as: 'agencies'
        });
      }
    }
  });

  return Tag;
};
