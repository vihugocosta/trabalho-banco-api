const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../../csv/marcas.csv');

exports.seed = async function (knex) {
    const data = fs.readFileSync(csvPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(Boolean)
        .map(line => {
            const [id, nome, site, telefone] = line.replace(/\r/g, '').split(',');
            return { id: Number(id), nome, site, telefone };
        });
    await knex('marcas').del();
    await knex('marcas').insert(data);
};
