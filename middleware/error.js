const errorHandler = (error, req, res, next) => {
    res.status(error.status || 500)
    res.json({Error: error.message})
}

module.exports = errorHandler;