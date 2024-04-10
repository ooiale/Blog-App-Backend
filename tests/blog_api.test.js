const {test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async() => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await Blog.insertMany(helper.initialBlogs)
})

const loggin = async () => {
    const user = {
        "username": "mari",
        "password": "mari",
    }
    await api.post('/api/users').send(user).expect(201)

    const response = await api
                        .post('/api/login')
                        .send(user)
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
    const token = await response.body. token
    return token
}

describe('tests using the initial blogs', () => {
    

    test('HTTP GET request to the /api/blogs are in json format', async() => {
        await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('Number of blogs written', async () => {
            const response = await api.get('/api/blogs')
        
            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

        test('id property exists', async() => {
            const blogs = await helper.blogsinDb()
        
            const blogsHaveId = (blogs) => {
                for (const blog of blogs) {
                    if (!blog.hasOwnProperty('id')) {
                        return false
                    }
                }
                return true
            }
        
            assert(blogsHaveId(blogs))
        })
})

describe('tests when adding new blogs', () => {

    test('adding new blog works', async () => {

        const token = await loggin()

        const blog = {
            "title": "Added from the testing",
            "author": "added from the testing",
            "url": "added from the testing",
            "likes": 1
        }

    
        await api
                .post('/api/blogs')
                .set('authorization', `Bearer ${token}`)
                .send(blog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsinDb()
        const titles = blogsAtEnd.map(b => b.title)
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        assert(titles.includes("Added from the testing"))
    })
    
    test('likes is set to 0 if .likes property is not given', async() => {

        const token = await loggin()

        const blog = {
            "title": "Added from the testing",
            "author": "added from the testing",
            "url": "added from the testing"
        }
    
        await api
                .post('/api/blogs')
                .set('authorization', `Bearer ${token}`)
                .send(blog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsinDb()
        const lastIndex = blogsAtEnd.length - 1
        assert.strictEqual(blogsAtEnd[lastIndex].likes, 0)
    })
    
    test('title and url are mandatory fields, otherwise error 400', async() => {

        const token = await loggin()

        const blog = {
            "author": "added from the testing",
        }
    
        const response = await api
                            .post('/api/blogs')
                            .set('authorization', `Bearer ${token}`)
                            .send(blog)
                            .expect(400)     
                            
        assert.strictEqual(response.body.error, 'Missing info')
    })
})

describe('tests when deleting blogs', () => {

    test('deleting a blog', async () => {

        const token = await loggin()

        const blog = {
            "title": "Added from the testing",
            "author": "added from the testing",
            "url": "added from the testing"
        }
    
        await api
                .post('/api/blogs')
                .set('authorization', `Bearer ${token}`)
                .send(blog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

        const blogsAtStart = await helper.blogsinDb()

        const blogToDelete = await Blog.findOne({title: "Added from the testing" })

        await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(204)
        
        const blogsAtEnd = await helper.blogsinDb()
        const titles = blogsAtEnd.map(b => b.title)
        assert(!titles.includes(blogsAtStart.title))
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })

})

describe('tests updating a blog', () => {

    test('updating a blogs title, author, url, likes', async() => {

        const blogsAtStart = await helper.blogsinDb()
        const blogToUpdate = blogsAtStart[0]
        const blog = {
            "title": "Updated Title",
            "author": "Updated author",
            "url": "Updated url",
            "likes": 3003
        }

        await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blog)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsinDb()
        const updatedBlog = blogsAtEnd.find(b => b.id = blogToUpdate.id)
        
        assert.strictEqual(updatedBlog.title, blog.title)
        assert.strictEqual(updatedBlog.author, blog.author)
        assert.strictEqual(updatedBlog.url, blog.url)
        assert.strictEqual(updatedBlog.likes, blog.likes)
    })
})


after(async () => {
    await Blog.deleteMany({})
    await mongoose.connection.close()
})