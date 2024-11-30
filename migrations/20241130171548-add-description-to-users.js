"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "description", {
      type: Sequelize.TEXT,
      allowNull: true, // Deve corresponder à definição no modelo
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "description");
  },
};
