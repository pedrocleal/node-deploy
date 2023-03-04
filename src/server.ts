import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import { z } from 'zod'

// Start the app
const app = fastify()

// Create connection with database
const prisma = new PrismaClient();

// Register the routes
app.get('/users', async () => {
  const users = await prisma.user.findMany()

  return { users }
})

app.post('/users', async (request, reply) => {
  // Validate the request body with zod
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email()
  });

  const { name, email } = createUserSchema.parse(request.body) // If the body is invalid, this will throw an error 

  await prisma.user.create({
    data: {
      name,
      email
    }
  })

  return reply.status(201).send();
})

// Start the server
app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('Server started at http://localhost:3333')
})