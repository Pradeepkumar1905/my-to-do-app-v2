const { app } = require('@azure/functions')
const container = require('../cosmosClient')
const { getUserFromRequest } = require('../auth')

app.http('getTodos', {
  route: 'todos',
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

      const userId = user.userId

      const { resources } = await container.items
        .query({
          query: 'SELECT * FROM c WHERE c.userId = @userId',
          parameters: [
            {
              name: '@userId',
              value: userId
            }
          ]
        })
        .fetchAll()

      return {
        status: 200,
        jsonBody: resources
      }
    } catch (error) {
      context.error(error)

      return {
        status: 500,
        jsonBody: {
          error: 'Failed to fetch todos'
        }
      }
    }
  }
})