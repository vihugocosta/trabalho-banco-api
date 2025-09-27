const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../../csv/pedidos.csv');

exports.seed = async function (knex) {
    const data = fs.readFileSync(csvPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(Boolean)
        .map(line => {
            const [id, data_pedido, id_cliente, valor_total] = line.replace(/\r/g, '').split(',');
            return { id: Number(id), data_pedido, id_cliente: Number(id_cliente), valor_total: Number(valor_total) };
        });
    await knex('pedidos').del();
    await knex('pedidos').insert(data);
};
