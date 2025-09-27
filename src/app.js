
const express = require('express');
const knex = require('knex');
const knexConfig = require('../knexfile');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const db = knex(knexConfig);


app.use(express.json());

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Trabalho Banco',
            version: '1.0.0',
            description: 'Documentação da API com Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: [__dirname + '/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const marcasRouter = require('./routes/marcas');
const produtosRouter = require('./routes/produtos');
const clientesRouter = require('./routes/clientes');
const pedidosRouter = require('./routes/pedidos');

app.use('/marcas', marcasRouter);
app.use('/produtos', produtosRouter);
app.use('/clientes', clientesRouter);
app.use('/pedidos', pedidosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
