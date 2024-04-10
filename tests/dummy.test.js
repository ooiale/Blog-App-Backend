const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const list = require('./hardcodedList')

describe('dummy test', () => {
    test('dummy returns 1', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    })
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        }
      ]

    

    test('total likes', () => {
        const result = listHelper.totalLikes(list)
        assert.strictEqual(result, 74)
    })
})

describe('favorite blog', () => {
    test('favorite blog', () => {

        const result = listHelper.favoriteBlog(list)
        assert.deepStrictEqual(result, list[3])
    })
})

describe('author with most blogs', () => {
    test('most blogs', () => {
        const result = listHelper.mostBlogs(list)
        assert.deepStrictEqual(result, {author: 'marinaul',blogs: 2})
    })
})

describe('author with most likes', () => {
    test('most likes', () => {
        const result = listHelper.mostLikes(list)
        assert.deepStrictEqual(result, {author: 'marinaul',likes: 30})
    })
})
