'use strict';
const { v4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
        uid: v4(),
        name: 'Admin',
        email: 'admin@admin.com',
        password: '$2b$10$on5br9W9viqdkDblB7tZVO4EyVGDNCjcBIT5CqS.f7SJD0uVdJ91m',
        attemptCount: 0,
        level: 1,
        key: 'uniquekey1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more user data as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
