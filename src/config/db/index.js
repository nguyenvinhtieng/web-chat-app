const mongoose = require('mongoose');
// let url = 'mongodb://localhost:27017/WebChatApp'
let url = 'mongodb+srv://vinhtieng:vinhtieng@webchatapp.4ntrm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

async function connect() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('connect successfully')
    }
    catch (e) {
        console.log('connect failure')
    }
}

module.exports = { connect };
