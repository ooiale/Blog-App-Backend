const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const requestLogger = (request, response, next) => {
  logger.info('Method', request.method)
  logger.info('Path', request.path)
  logger.info('Body', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError' && error.message.includes('is shorter than the minimum allowed length')) {
    return response.status(400).json({error: 'Username must be at least 3 characters long'})
  } else if (error.name === 'JsonWebTokenError' && error.message.includes('jwt must be provided')) {
    return response.status(401).json({error: 'invalid token'})
  }

  next(error)
}

const tokenExtractor = async(request, response, next) => {
    const authorization = request.headers.authorization
    if (authorization) {
      const token = authorization.replace('Bearer ', '')
      request.token = token
    } else {
      request.token = null
    }
    
    next()
}

const userExtractor = async(request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    request.user = user
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}