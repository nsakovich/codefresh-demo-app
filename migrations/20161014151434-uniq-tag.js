'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.addIndex('Tags', ['name'], {
      indexName: 'UniqTagNameIndex',
      indicesType: 'UNIQUE'
    });
  },

  down: function (queryInterface) {
    return queryInterface.removeIndex('Tags', 'UniqTagNameIndex');
  }
};
