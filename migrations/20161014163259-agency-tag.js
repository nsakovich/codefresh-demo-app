'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('AgencyTag', {
      agency_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tag_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: function(queryInterface) {
    return queryInterface.dropTable('AgencyTag');
  }
};
