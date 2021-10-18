const Account = require('../models/Account')
const Chat = require('../models/Chat')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const TOKEN_KEY = "password"
const Room = require('../models/Room')
const ChatRoom = require('../models/ChatRoom')
const multiparty = require('multiparty');
const fs = require('fs')
const moment = require("moment")

class MainController {
    // GET '/login'
    renderLogin(req, res) {
        res.render('./login')
    }

    // GET '/register
    renderRegister(req, res) {
        res.render('./register')
    }

    // GET '/home'
    async renderHome(req, res) {
        let _id = getIdUser(req)
        let users = await Account.find({ _id: { $ne: _id } }).lean()
        let rooms = await Room.find({}).lean()
        res.render('./home', { users, rooms })
    }

    async isLogined(req, res, next) {
        try {
            let _id = getIdUser(req)
            let user = await Account.findOne({ _id: _id });
            if (user) {
                next()
            } else {
                res.redirect('/login')
            }
        } catch (err) {
            console.log('Cookie expiration!')
            res.redirect('/login')
        }
    }

    async paramIsMatch(req, res, next) {
        if (req.query.user === getIdUser(req)) {
            next();
        } else {
            res.redirect('/login')
        }
    }

    // POST '/register'
    async register(req, res, next) {
        try {
            let account = new Account(req.body)
            const salt = await bcrypt.genSalt(10);
            account.password = await bcrypt.hash(account.password, salt)
            let ac = await account.save();
            return res.json({ success: true, message: "Create account successfully", data: { name: ac.name, id: ac._id } })
        } catch {
            return res.json({ success: false, message: "Has error while creating account" })
        }
    }

    async isHasAccount(req, res, next) {
        try {
            let user = await Account.findOne({ username: req.body.username })
            if (user) {
                return res.json({ success: false, message: "Username was exits!" })
            } else {
                next()
            }
        } catch {
            return res.json({ success: false, message: "Has error while creating account!" })
        }
    }

    // POST '/login'
    async login(req, res, next) {
        let user = await Account.findOne({ username: req.body.username })
        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (validPassword) {
                var token = jwt.sign({
                    _id: user._id
                }, TOKEN_KEY);
                return res.json({ success: true, message: "Login successful", token: token, name: user.name, id: user._id });
            } else {
                return res.json({ success: false, message: "Incorrect password!" })
            }
        } else {
            return res.json({ success: false, message: "Account not exist!" })
        }
    }


    async allChatUser(req, res, next) {
        let idMe = getIdUser(req)
        let idUser = req.body.id
        let chats = await Chat.find({
            $or: [{ $and: [{ sender: idMe }, { receiver: idUser }] },
            { $and: [{ sender: idUser }, { receiver: idMe }] }]
        })
        return res.json({ success: true, data: chats })

    }

    async chatMessage(req, res, next) {
        try {
            let data = {
                receiver: req.body.receiver,
                sender: getIdUser(req),
                content: req.body.content,
                time: moment().format("h:mm a")
            }
            let chat = new Chat(data)
            let dataChat = await chat.save()
            return res.json({ success: true, data: dataChat })
        } catch {
            return res.json({ success: false, message: "Has error!" })
        }
    }
    async chatMessageToRoom(req, res, next) {
        try {
            let data = {
                ...req.body,
                time: moment().format("h:mm a")
            }
            let chat = new ChatRoom(data)
            let dataChat = await chat.save()
            return res.json({ success: true, data: dataChat })
        } catch {
            return res.json({ success: false, message: "Has error!" })
        }
    }

    // DELETE '/delete-chat
    async deleteChat(req, res, next) {
        try {
            let chat = await Chat.findOne({ $and: [{ _id: req.body.id }, { sender: getIdUser(req) }] })
            chat.delete = 'yes'
            chat.save(err => {
                if (err) console.log(err)
            })
            return res.json({ success: true, message: "Delete chat successfully" })
        } catch (err) {
            return res.json({ success: false, message: "Has error!" })
        }
    }

    // POST '/create-room'
    async createRoom(req, res, next) {
        try {
            const form = new multiparty.Form()
            form.parse(req, async (err, fields, files) => {
                let data = { name: fields.roomname[0], usercreate: getIdUser(req) }
                let room = new Room(data)
                let r = await room.save()
                files.image.forEach(file => {
                    fs.copyFile(file.path, './src/public/images/rooms/' + r.slug + '.jpg', err => {
                        if (err) console.log(err)
                    })
                })
                return res.json({ success: true, message: "Create room successfully", data: r })
            })
        }
        catch {
            return res.json({ success: false, message: "Has error creating room!" })
        }
    }

    async isHasRoom(req, res, next) {
        try {
            const form = new multiparty.Form()
            form.parse(req, async (err, fields, files) => {

                let room = await Room.findOne({ name: fields.roomname[0] })
                if (room) {
                    return res.json({ success: false, message: "Room name was exitst!" })
                } else {
                    next()
                }
            })
        }
        catch {
            return res.json({ success: false, message: "Has error creating room!" })
        }
    }

    async getAllChatRoom(req, res, next) {
        let chats = await ChatRoom.find({ idroom: req.body.id })
        return res.json({ success: true, message: "Get data successfully!", chats })
    }

    // POST '/get-all-chat-room'
    async getDataRoom(req, res, next) {
        let room = await Room.findOne({ _id: req.body._id })
        return res.json({ success: true, message: "Get data successfully!", data: room })
    }

}

function getIdUser(req) {
    try {
        let token = req.cookies.token
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let userid = decodedCookie._id;
        return userid
    }
    catch {
        console.log(err)
        return null
    }
}


module.exports = new MainController();
