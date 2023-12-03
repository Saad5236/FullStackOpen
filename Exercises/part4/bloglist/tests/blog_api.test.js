const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")
const api = supertest(app)
const Blog = require("../models/blog")

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("unique identifier property of the blog posts is named id and not _id", async () => {
  const response = await api.get("/api/blogs")
  const blogs = response.body
  console.log(blogs, blogs[0].id)

  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
  // expect(blogs[0].id).toBeDefined()
})

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "This is new blog",
    author: "Saad Atif",
    url: "https://www.google.com",
    likes: 10,
  }

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

afterAll(async () => {
  await mongoose.connection.close()
})
