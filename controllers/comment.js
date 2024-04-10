const commentRouter = require('express').Router()
const Comment = require('../models/comments')

commentRouter.get('/', async (request, response) => {
    const comments = await Comment.find({})
    response.status(200).json(comments)
})

commentRouter.post('/', async (request, response) => {
    try {
        const {comment, blogId} = request.body
        const newMessage = new Comment({comment, blogId})
        const savedMessage = await newMessage.save()
        response.status(201).send(savedMessage)
    } catch (error) {
        console.log('error posting comment', error)
        response.status(500).json({error: 'server error posting comment'})

    }
})

module.exports = commentRouter