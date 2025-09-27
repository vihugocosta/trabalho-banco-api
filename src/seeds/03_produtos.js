const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../../csv/produtos.csv');

exports.seed = async function (knex) {
    const data = fs.readFileSync(csvPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(Boolean)
        .map(line => {
            const [id, nome, preco, estoque, id_marca] = line.replace(/\r/g, '').split(',');
            return { id: Number(id), nome, preco: Number(preco), estoque: Number(estoque), id_marca: Number(id_marca) };
        });
    await knex('produtos').del();
    await knex('produtos').insert(data);
};
