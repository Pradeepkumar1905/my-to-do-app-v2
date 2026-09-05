const { app } = require('@azure/functions')
const container = require('../cosmosClient')
const { getUserFromRequest } = require('../auth')

app.http('deleteTodo', {
  route: 'todos/{id}',
  methods: ['DELETE'],
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

      await container
        .item(id, userId)
        .delete()

      return {
        status: 204
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