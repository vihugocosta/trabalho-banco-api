exports.up = function (knex) {
    return knex.schema.createTable('itens_pedido', function (table) {
        table.integer('id_pedido').unsigned().notNullable().references('id').inTable('pedidos');
        table.integer('id_produto').unsigned().notNullable().references('id').inTable('produtos');
        table.integer('quantidade').notNullable();
        table.integer('preco_unitario').notNullable();
        table.primary(['id_pedido', 'id_produto']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('itens_pedido');
};
