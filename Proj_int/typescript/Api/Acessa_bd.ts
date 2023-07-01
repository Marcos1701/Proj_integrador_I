import Client from 'pg'

const client = new Client.Client({
    host: 'localhost',
    port: 5432,
    database: 'planr',
    user: 'postgres',
    password: 'postgres'
});

client.connect();
export { client };