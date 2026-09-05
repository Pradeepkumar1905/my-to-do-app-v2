const { app } = require('@azure/functions')
const container = require('../cosmosClient')
const { getUserFromRequest } = require('../auth')

app.http('getTodoById', {
  route: 'todos/{id}',
  methods: ['GET'],
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

      const { resource } = await container
        .item(id, userId)
        .read()

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