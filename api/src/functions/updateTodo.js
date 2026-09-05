const { app } = require('@azure/functions')
const container = require('../cosmosClient')
const { getUserFromRequest } = require('../auth')

app.http('updateTodo', {
  route: 'todos/{id}',
  methods: ['PUT'],
  authLevel: 'anonymous',

  handler: async (request, context) => {
    try {
      const user = getUserFromRequest(request)

      if (!user) {
        return {
          status: 401,
          jsonBody: {
            error: 'Authentication required'
          }
        }
      }

      const id = request.params.id
      const userId = user.userId
      const body = await request.json()

      const { resource: existingTodo } =
        await container
          .item(id, userId)
          .read()

      const updatedTodo = {
        ...existingTodo,
        title: body.title ?? existingTodo.title,
        completed: body.completed ?? existingTodo.completed,
        updatedAt: new Date().toISOString()
      }

      const { resource } =
        await container
          .item(id, userId)
          .replace(updatedTodo)

      return {
        status: 200,
        jsonBody: resource
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