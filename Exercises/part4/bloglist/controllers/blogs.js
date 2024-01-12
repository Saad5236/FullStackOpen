const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = (request) => {
  const authorization = request.get("authorization")
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    if (authorization.includes("bearer "))
      return authorization.replace("bearer ", "")
    else return authorization.replace("Bearer ", "")
  }
  return null
}

blogsRouter.get("/", async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs)
  // })

  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
  const { body } = request

  if (!body.url || !body.title || !body.author) {
    response.status(400).json({ error: "Url, Title or Author is missing" })
  }

  if (!body.likes) {
    body.likes = 0
  }

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  console.log("decodedToken: ", decodedToken)

  if (!decodedToken.id) {
    return response.status(401).json({ error: "Invalid token" })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes,
    user: user._id,
  })

  // const blog = new Blog(request.body)

  // blog.save().then((result) => {
  //   response.status(201).json(result)
  // })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: body.likes },
    {
      new: true,
    }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter
