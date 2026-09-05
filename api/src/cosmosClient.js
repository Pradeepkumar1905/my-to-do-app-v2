const { CosmosClient } = require('@azure/cosmos')

const client = new CosmosClient(
  process.env.COSMOS_CONNECTION_STRING
)

const database = client.database('TodoApp')
const container = database.container('Todos')

module.exports = container