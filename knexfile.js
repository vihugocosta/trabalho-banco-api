module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'rpvbanco',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
    },
    migrations: {
        directory: './src/migrations'
    },
    seeds: {
        directory: './src/seeds'
    }
};
