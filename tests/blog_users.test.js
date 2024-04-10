const {test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const assert = require('node:assert')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async() => {
    await User.deleteMany({})

    await User.insertMany(helper.initialUsers)
})

describe('tests using the initial users', () => {
    

    test('HTTP GET request to the /api/users are in json format', async() => {
        await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

})

describe('returning proper error messages', () => {

    test('invalid username returns the correct error', async() => {
        const userToAdd = {
            "username": "ma",
            "name": "username was invalid",
            "password": "123"
        }
        const response = await api
                                .post('/api/users')
                                .send(userToAdd)
                                .expect(400)
        
        
        assert.strictEqual(response.body.error, 'Username must be at least 3 characters long')
    })

    test ('invalid password returns error', async() => {
        const userToAdd = {
            "username": "marinaul jones",
            "name": "password is invalid",
            "password": "12"
        }
        const response = await api
                                .post('/api/users')
                                .send(userToAdd)
                                .expect(400)
        
        
        assert.strictEqual(response.body.error, 'Password must be at least 3 characters long')
    })
})



after(async () => {
    await mongoose.connection.close()
})