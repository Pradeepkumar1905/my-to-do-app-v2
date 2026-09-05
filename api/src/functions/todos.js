const { app } = require('@azure/functions')
const container = require('./cosmosClient')

app.http('todos', {
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  authLevel: 'anonymous',

handler: async (request, context) => {
  try {
    if (request.method === 'GET') {
      const { resources } = await container.items
        .query('SELECT * FROM c WHERE c.userId = "temporary-user"')
        .fetchAll()

      return {
        status: 200,
        jsonBody: resources
      }
    }

    if (request.method === 'POST') {
      const body = await request.json()

      if (!body.title || body.title.trim() === '') {
        return {
          status: 400,
          jsonBody: {
            error: 'Title is required'
          }
        }
      }

      const todo = {
        id: Date.now().toString(),
        userId: 'temporary-user',
        title: body.title,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const { resource } = await container.items.create(todo)

      return {
        status: 201,
        jsonBody: resource
      }
    }
    if (request.method === 'PUT') {
        const id = request.params.id
        const body = await request.json()

        const { resource: existingTodo } =
            await container.item(id, 'temporary-user').read()

        const updatedTodo = {
            ...existingTodo,
            title: body.title ?? existingTodo.title,
            completed: body.completed ?? existingTodo.completed,
            updatedAt: new Date().toISOString()
        }

        const { resource } =
            await container.item(id, 'temporary-user').replace(updatedTodo)

        return {
            status: 200,
            jsonBody: resource
        }
    }

    if (request.method === 'DELETE') {
        const id = request.params.id

        await container.item(id, 'temporary-user').delete()

        return {
            status: 204
        }
    }
  } catch (error) {
    context.error(error)

    return {
      status: 500,
      jsonBody: {
        error: 'Something went wrong'
      }
    }
  }
}
})