"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar uma nova coluna temporária com o tipo JSON
    await queryInterface.addColumn("Places", "fotos_temp", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Copiar os dados da coluna original para a nova coluna
    await queryInterface.sequelize.query(`
      UPDATE "Places"
      SET "fotos_temp" = ARRAY_TO_JSON("fotos")
    `);

    // Remover a coluna original
    await queryInterface.removeColumn("Places", "fotos");

    // Renomear a nova coluna para o nome original
    await queryInterface.renameColumn("Places", "fotos_temp", "fotos");

    console.log("Coluna 'fotos' atualizada com sucesso para o tipo JSON.");
  },

  async down(queryInterface, Sequelize) {
    // Adicionar uma nova coluna temporária com o tipo ARRAY de STRING
    await queryInterface.addColumn("Places", "fotos_temp", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    // Copiar os dados da coluna JSON de volta para o formato ARRAY
    await queryInterface.sequelize.query(`
      UPDATE "Places"
      SET "fotos_temp" = JSON_TO_ARRAY("fotos")
    `);

    // Remover a coluna JSON original
    await queryInterface.removeColumn("Places", "fotos");

    // Renomear a nova coluna para o nome original
    await queryInterface.renameColumn("Places", "fotos_temp", "fotos");

    console.log("Coluna 'fotos' revertida para o tipo ARRAY de STRING.");
  },
};
