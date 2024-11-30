"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('Starting migration for changing "fotos" column.');

    // Step 1: Remove the 'fotos' column
    console.log('Step 1: Dropping "fotos" column.');
    await queryInterface.removeColumn("Places", "fotos");
    console.log("Completed Step 1.");

    // Step 2: Add the 'fotos' column with new definition
    console.log('Step 2: Adding "fotos" column with new data type.');
    await queryInterface.addColumn("Places", "fotos", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });
    console.log("Completed Step 2.");

    console.log("Migration completed successfully.");
  },

  down: async (queryInterface, Sequelize) => {
    console.log('Reverting migration for "fotos" column.');

    // Remove the 'fotos' column
    await queryInterface.removeColumn("Places", "fotos");

    // Add the 'fotos' column with original definition
    await queryInterface.addColumn("Places", "fotos", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
    });

    console.log("Reversion completed.");
  },
};
