import createServer from 'fastify'

const server = createServer()

server.get('/', {
  handler: async (request, reply) => {
    return reply.code(200).send()
  }
})

await server.listen(3000)
