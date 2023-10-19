const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  let totalLikes = 0
  blogs.forEach((blog) => (totalLikes = totalLikes + blog.likes))
  return totalLikes
}

const favoriteBlog = (blogs) => {
  let mostLikedBlog = blogs[0]
  blogs.forEach((blog) => {
    if (blog.likes > mostLikedBlog.likes) {
      mostLikedBlog = blog
    }
  })
  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
