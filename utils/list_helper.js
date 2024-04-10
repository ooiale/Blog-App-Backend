const lodash = require('lodash');


const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = (sum, current) => {
        return sum + current.likes
    }
    return blogs.reduce(likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((prev, current) => 
        (prev.likes > current.likes ? prev : current), {});
}

const mostBlogs = (blogs) => {
    const count = lodash.countBy(blogs, 'author')
    const mostBlog = lodash.maxBy(lodash.toPairs(count), ([key, value]) => value)
    return {author: mostBlog[0], blogs: mostBlog[1]}
}

const mostLikes = (blogs) => {
    const count = blogs.reduce((acc, current) => {
        acc[current.author] = (acc[current.author] || 0) + current.likes
        return acc
    }, {})
    const mostLike = lodash.maxBy(lodash.toPairs(count), ([key, value]) => value)
    return {author: mostLike[0], likes: mostLike[1]}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}