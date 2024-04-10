const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema ({
    comment: {
        type: String,
        required: true
    },
    blogId: {
        type: String,
        required: true
    }
})

commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
    }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment