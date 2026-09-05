const { app } = require('@azure/functions')
const container = require('../cosmosClient')
const { getUserFromRequest } = require('../auth')

app.http('createTodo', {
  route: 'todos',
  methods: ['POST'],
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
        userId: user.userId,
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
    } catch (error) {
      context.error(error)

      return {
        status: 500,
        jsonBody: {
          error: 'Failed to create todo'
        }
      }
    }
  }
})