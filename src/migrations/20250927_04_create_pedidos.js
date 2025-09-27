exports.up = function (knex) {
    return knex.schema.createTable('pedidos', function (table) {
        table.increments('id').primary();
        table.date('data_pedido').notNullable();
        table.integer('id_cliente').unsigned().notNullable().references('id').inTable('clientes');
        table.integer('valor_total').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('pedidos');
};
