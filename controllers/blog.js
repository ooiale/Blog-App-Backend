const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username : 1, name: 1})
    response.json(blogs)
    
})

blogRouter.post('/', async (request, response) => {
    let {title, author, url, likes} = request.body 

    if (!title || !url) {
        return response.status(400).json({error: 'Missing info'})
    }
    
    likes = likes || 0

    const user = request.user

    const newBlog = {
        title,
        author,
        url,
        likes,
        user: user.id
    }

    const blog = new Blog(newBlog)
    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {

    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({error: 'user is not the creator of the blog'})
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', {username : 1, name: 1})
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})


blogRouter.put('/:id', async (request, response) => {
    const {title, author, url, likes, user} = request.body
    //const user = request.user._id
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        {title, author, url, likes, user: user.id},
        {new: true, runValidators: true}
    )

    response.json(updatedBlog)
})





module.exports = blogRouter