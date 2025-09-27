const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../../csv/clientes.csv');

exports.seed = async function (knex) {
    const data = fs.readFileSync(csvPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(Boolean)
        .map(line => {
            const [id, nome, email, cidade] = line.replace(/\r/g, '').split(',');
            return { id: Number(id), nome, email, cidade };
        });
    await knex('clientes').del();
    await knex('clientes').insert(data);
};
