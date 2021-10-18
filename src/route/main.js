const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController');

router.get('/home', MainController.isLogined, MainController.renderHome)
router.get('/login', MainController.renderLogin)
router.post('/login', MainController.login)
router.get('/register', MainController.renderRegister)
router.post('/register', MainController.isHasAccount, MainController.register)
router.post('/get-data-chat', MainController.isLogined, MainController.allChatUser)
router.post('/send-message', MainController.isLogined, MainController.chatMessage)
router.post('/send-message-to-room', MainController.isLogined, MainController.chatMessageToRoom)
router.delete('/delete-chat', MainController.isLogined, MainController.deleteChat)
router.post('/get-all-chat-room', MainController.isLogined, MainController.getAllChatRoom)
router.post('/get-name-slug-room', MainController.isLogined, MainController.getDataRoom)
router.post('/create-room', MainController.isLogined,/*MainController.isHasRoom,*/ MainController.createRoom)
router.get('/', MainController.renderLogin)

module.exports = router;