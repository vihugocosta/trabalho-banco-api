const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../../csv/itens_pedido.csv');

exports.seed = async function (knex) {
    const data = fs.readFileSync(csvPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(Boolean)
        .map(line => {
            const [id_pedido, id_produto, quantidade, preco_unitario] = line.replace(/\r/g, '').split(',');
            return { id_pedido: Number(id_pedido), id_produto: Number(id_produto), quantidade: Number(quantidade), preco_unitario: Number(preco_unitario) };
        });
    await knex('itens_pedido').del();
    await knex('itens_pedido').insert(data);
};
