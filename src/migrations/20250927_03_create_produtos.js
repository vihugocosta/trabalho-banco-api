exports.up = function (knex) {
    return knex.schema.createTable('produtos', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.integer('preco').notNullable();
        table.integer('estoque').notNullable();
        table.integer('id_marca').unsigned().notNullable().references('id').inTable('marcas');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('produtos');
};
