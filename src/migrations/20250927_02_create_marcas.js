exports.up = function (knex) {
    return knex.schema.createTable('marcas', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('site').notNullable();
        table.string('telefone').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('marcas');
};
