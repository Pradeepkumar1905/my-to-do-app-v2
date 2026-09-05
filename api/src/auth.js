function getUserFromRequest(request) {
  const clientPrincipal = request.headers.get(
    'x-ms-client-principal'
  )

  if (!clientPrincipal) {
    return null
  }

  const decoded = Buffer.from(
    clientPrincipal,
    'base64'
  ).toString('utf8')

  const user = JSON.parse(decoded)

  console.log('Authenticated user:', user)

  return user
}

module.exports = {
  getUserFromRequest
}