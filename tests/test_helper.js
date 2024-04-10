const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "the adventures of naul",
        "author": "marinaul",
        "url": "https://www.youtube.com/@HoLoWiWi",
        "likes": 5
    },
    {
        "title": "gymnast speedruns",
        "author": "gymnast86",
        "url": "https://www.youtube.com/@Gymnast86",
        "likes": 86
    }
]

const initialUsers = [
    {
        "username": "marinaul",
        "name": "marinaul",
        "password": "marinaul"
    },
    {
        "username": "gymnast",
        "name": "gymnast",
        "password": "gymnast"
    }
]

const blogsinDb = async() => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

module.exports = {initialBlogs, blogsinDb, initialUsers}