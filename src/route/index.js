const MainRouter = require('./main')
function route(app){
    app.use('/', MainRouter)
}

module.exports = route;