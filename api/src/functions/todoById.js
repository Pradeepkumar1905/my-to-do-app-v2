const { app } = require('@azure/functions')
const container = require('./cosmosClient')

app.http('todoById', {
  route: 'todos/{id}',
  methods: ['GET', 'PUT', 'DELETE'],
  authLevel: 'anonymous',

  handler: async (request, context) => {
    const id = request.params.id

    try {
      if (request.method === 'GET') {
        const { resource } = await container
          .item(id, 'temporary-user')
          .read()

        return {
          status: 200,
          jsonBody: resource
        }
      }

      if (request.method === 'PUT') {
        const body = await request.json()

        const { resource: existingTodo } = await container
          .item(id, 'temporary-user')
          .read()

        const updatedTodo = {
          ...existingTodo,
          title: body.title ?? existingTodo.title,
          completed: body.completed ?? existingTodo.completed,
          updatedAt: new Date().toISOString()
        }

        const { resource } = await container
          .item(id, 'temporary-user')
          .replace(updatedTodo)

        return {
          status: 200,
          jsonBody: resource
        }
      }

      if (request.method === 'DELETE') {
        await container
          .item(id, 'temporary-user')
          .delete()

        return {
          status: 204
        }
      }
    } catch (error) {
      context.error(error)

      return {
        status: 404,
        jsonBody: {
          error: 'Todo not found'
        }
      }
    }
  }
})