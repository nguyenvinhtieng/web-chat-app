const URL = "https://web-chat-app-nvt.herokuapp.com/"
function changeBorderBox(element, status = "show") {
    let parent = element.parentNode
    let warning = parent.childNodes[5] // index warning icon
    if (status === "hide") {
        element.style.border = "1px solid var(--purple-color-input)"
        warning.style.display = "none"
        element.style.background = "transparent"
    } else {
        element.style.border = "1px solid var(--red-color)"
        warning.style.display = "block"
        element.style.background = "#fae9e9"
    }
}

function focusBox(element) {
    element.focus()
    changeBorderBox(element)
}

function blurBox(...nodes) {
    nodes.forEach(element => {
        element.onblur = (e) => {
            if (element.value.trim() === '') {
                changeBorderBox(element)
            }
        }
    })
}

function keyDownBox(...nodes) {
    nodes.forEach(element => {
        element.onkeydown = (e) => {
            changeBorderBox(element, "hide")
        }
    })
}

function setCookie(cname, cvalue, exminutes) {
    const d = new Date();
    d.setTime(d.getTime() + (exminutes * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function toast_header({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");
        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);
        // Remove toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };
        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                      <div class="toast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__msg">${message}</p>
                      </div>
                      <div class="toast__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
        main.appendChild(toast);
    }
}


function showSuccessToast(message, title = "Successfully") {
    toast_header({
        title: title,
        message: message,
        type: 'success',
        duration: 3000
    })
}

function showErrorToast(message, title = "Error") {
    toast_header({
        title: title,
        message: message,
        type: 'error',
        duration: 3000
    })
}

function showNotifyToast(message, title = "Notification") {
    toast_header({
        title: title,
        message: message,
        type: 'info',
        duration: 3000
    })
}


// JS FOR LOGIN PAGE
if (document.getElementById('login-page')) {
    let TIME_VALID_COOKIE = 60 // minutes
    let usernameBox = document.getElementById('username')
    let passwordBox = document.getElementById('password')
    let btnLogin = document.getElementById('btn-login')
    keyDownBox(usernameBox, passwordBox)
    blurBox(usernameBox, passwordBox)

    function validateLogin(username, password) {
        if (username === '') {
            focusBox(usernameBox)
            showErrorToast("Please enter a username")
            return false
        }
        if (password === '') {
            focusBox(passwordBox)
            showErrorToast("Please enter a password")
            return false
        }
        return true
    }

    function Login(username, password) {
        $.ajax({
            url: '/login',
            type: 'POST',
            data: { username, password },
            success: function (response) {
                if (response.success) {
                    showSuccessToast(response.message)
                    let token = response.token
                    setCookie("token", token, TIME_VALID_COOKIE)
                    console.log('run')
                    window.location.href = "/home?user=" + response.id + '&name=' + response.name;
                } else {
                    showErrorToast(response.message)
                }
            }
        })
    }

    btnLogin.onclick = (e) => {
        e.preventDefault();
        let username = usernameBox.value.trim()
        let password = passwordBox.value.trim()
        if (validateLogin(username, password)) {
            Login(username, password)
        }
    }
}
// JS FOR REGISTER PAGE
else if (document.getElementById('register-page')) {
    let usernameBox = document.querySelector('#username')
    let passwordBox = document.querySelector('#password')
    let repeatPasswordBox = document.querySelector('#repeated-password')
    let nameBox = document.querySelector('#name')
    let btnRegister = document.querySelector('#btn-register')

    keyDownBox(usernameBox, passwordBox, repeatPasswordBox, nameBox)
    blurBox(usernameBox, passwordBox, repeatPasswordBox, nameBox)

    function validateRegister(username, password, rpPass, name) {
        if (username === '') {
            showErrorToast("Please enter a username")
            focusBox(usernameBox)
            return false
        }
        if (password === '') {
            showErrorToast("Please enter a password")
            focusBox(passwordBox)
            return false
        }
        if (password.length < 8) {
            showErrorToast("Password must be at least 8 characters")
            focusBox(passwordBox)
            return false
        }
        if (password !== rpPass) {
            showErrorToast("Repeat password not match")
            focusBox(repeatPasswordBox)
            return false
        }
        if (name === "") {
            showErrorToast("Please enter Name")
            focusBox(nameBox)
            return false
        }
        return true
    }

    function Register(username, password, name) {
        $.ajax({
            url: '/register',
            type: 'POST',
            data: { username: username, password: password, name: name },
            success: function (response) {
                if (response.success) {
                    showSuccessToast(response.message)
                    usernameBox.value = ""
                    passwordBox.value = ""
                    repeatPasswordBox.value = ""
                    nameBox.value = ""
                    socketCreateAccount(response.data)
                } else {
                    showErrorToast(response.message)
                }
            }
        })
    }

    function socketCreateAccount(data) {
        var socket = io(URL);
        socket.on("connect", () => {
            socket.send("Connected!");
        })
        socket.emit('user-create-account', data)
    }

    btnRegister.onclick = (e) => {
        e.preventDefault();
        let username = usernameBox.value
        let password = passwordBox.value
        let rpPass = repeatPasswordBox.value
        let name = nameBox.value
        if (validateRegister(username, password, rpPass, name)) {
            Register(username, password, name)
        }
    }
}

else if (document.getElementById('home-page')) {

    let idUserChatNow = ''
    let itemClicked
    let idChat = ''
    EventClickUser()

    let btnDrop = document.querySelector('.drop-down')
    btnDrop.onclick = (e) => {
        document.querySelector('.drop__down__menu').style.display = "block";
    }

    let ul = document.querySelector('.list-user')
    ul.onclick = (e) => {
        if (e.target.closest('.user-item')) {
            mobileResponsive();
            let messageContent = document.querySelector('.chat__with__user')
            messageContent.style.display = "flex"
            let tagP = document.querySelector('.slect-user-to-chat')
            tagP.style.display = "none"
            document.querySelector('.chat__with__room').style.display = "none"
        }
    }

    function mobileResponsive() {
        if (window.innerWidth < 480) {
            document.querySelector('.message__user').style.display = 'none'
            document.querySelector('.message__chat').style.display = 'flex'
        }
    }

    let btnBack = document.querySelector('.back')
    btnBack.onclick = (e) => {
        document.querySelector('.message__user').style.display = 'flex'
        document.querySelector('.message__chat').style.display = 'none'
    }

    let btnExit = document.querySelector('.btn-exit')
    btnExit.onclick = (e) => {
        setCookie('token', null)
        window.location.href = '/'
    }

    window.onclick = (e) => {
        if (!e.target.closest('.drop__down__menu') && !e.target.closest('.drop-down')) {
            document.querySelector('.drop__down__menu').style.display = "none";
        }
    }

    function EventClickUser() {
        let users = document.querySelectorAll('.user-item')
        users.forEach(user => {
            user.onclick = (e) => {
                let id = user.getAttribute('data-id')
                itemClicked = user
                idUserChatNow = id
                getDataChat(id)
                getNameUserChat()
                if (userTypingMe.indexOf(id) !== -1) {
                    statusTyping(id)
                }
            }
        })
    }

    function getDataChat(id) {
        $.ajax({
            url: '/get-data-chat',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                if (response.success) {
                    renderDataChat(response.data)
                } else {
                    showErrorToast(response.message)
                }
            }
        })
    }

    function renderDataChat(data) {
        let main = document.querySelector('.message__chat__content')
        main.innerHTML = ''
        data.forEach(chat => {
            let div = document.createElement('div')
            if (chat.sender === idUserChatNow) {
                div.className = 'chat chat__user'
            } else {
                div.className = 'chat chat__me'
            }
            // add avatar 
            div.innerHTML = `<div class="avatar-sm-circle">
                                <img src="/images/default-avatar.jpg" alt="">
                            </div>`
            // add content
            let divContent = document.createElement('div')
            let isDelete = false
            if (chat.delete) {
                divContent.className = 'chat__content chat__deleted'
                divContent.innerText = "This message was be deleted!"
                divContent.setAttribute('data-id', chat._id)
                isDelete = true
            } else {
                divContent.className = 'chat__content'
                divContent.innerText = chat.content
                divContent.setAttribute('data-id', chat._id)
            }
            div.appendChild(divContent)
            // if me
            if (chat.sender !== idUserChatNow && !isDelete) {
                let divOperation = document.createElement('div')
                divOperation.className = 'operration delete-chat'
                divOperation.setAttribute('data-id', chat._id)
                divOperation.innerHTML = `<i class="fas fa-trash" data-id="${chat._id}"></i>`
                div.appendChild(divOperation)
            }
            // time chat__content
            let divTime = document.createElement('div')
            divTime.className = 'chat__time'
            divTime.innerText = chat.time
            div.appendChild(divTime)
            main.appendChild(div)
        })
        scrollBottomChat()
    }

    function scrollBottomChat() {
        document.querySelector(".message__chat__content").scrollTo(0, document.querySelector(".message__chat__content").scrollHeight);
    }

    let btnSend = document.querySelector('.btn-send')
    btnSend.onclick = (e) => {
        e.preventDefault()
        let content = document.getElementById('text-message').value.trim()
        if (content === '') {
            showErrorToast("Please enter text content!")
        } else {
            sendMessage(content);
        }
    }

    function getNameUserChat() {
        // get name user from view
        let name = itemClicked.childNodes[1].childNodes[3].textContent.trim()
        // set data to view
        document.querySelector('.user__name__chat').textContent = name
    }
    let boxMessage = document.getElementById('text-message')
    boxMessage.onfocus = (e) => {
        sendTypingSocket()
    }
    boxMessage.onblur = (e) => {
        sendBlurSocket()
    }
    function sendMessage(content) {
        $.ajax({
            url: '/send-message',
            type: 'POST',
            data: { content: content, receiver: idUserChatNow },
            success: function (response) {
                if (response.success) {
                    document.getElementById('text-message').value = ''
                    sendMessageSocket(response.data)
                    renderChatToMyView(response.data)
                } else {
                    showErrorToast(response.message)
                }
            }
        })
    }

    let chatContent = document.querySelector('.message__chat__content')
    chatContent.onclick = (e) => {
        if (e.target.closest('.delete-chat')) {
            idChat = e.target.getAttribute('data-id')
            modalDeleteChat(true)
        }
    }
    function deleteChatMyView(isJustRender = false) {
        let id = idChat
        let itemNeedDelete
        let listChat = document.querySelectorAll('.delete-chat')
        listChat.forEach(chat => {
            if (chat.getAttribute('data-id') === id) {
                itemNeedDelete = chat
            }
        }) //616a4cfe778f7f55bcdcd534
        itemNeedDelete.parentNode.innerHTML = `<div class="avatar-sm-circle">
                                        <img src="/images/default-avatar.jpg" alt="">
                                    </div>
                                    <div class="chat__content chat__deleted" data-id="616a4c22778f7f55bcdcd520">
                                        This message was be deleted!
                                    </div>`
    }

    function deleteChat() {
        let id = idChat.trim()
        $.ajax({
            url: '/delete-chat',
            type: 'DELETE',
            data: { id: id },
            success: function (response) {
                if (response.success) {
                    deleteChatMyView()
                    sendDeleteChatSocket(id)
                } else {
                    showErrorToast(response.message)
                }
                modalDeleteChat(false)
            }
        })
    }

    function modalDeleteChat(status = false) {
        if (status) {
            document.querySelector('.modal__delete__chat').style.display = "flex";
            document.querySelector('.hidden-modal-delete').style.display = "flex";
        } else {
            document.querySelector('.modal__delete__chat').style.display = "none";
            document.querySelector('.hidden-modal-delete').style.display = "none";
        }
    }

    let layer = document.querySelector('.hidden-modal-delete')
    layer.onclick = (e) => { modalDeleteChat(false) }

    let btnCancel = document.querySelector('.btn-cancel-delete')
    btnCancel.onclick = (e) => { modalDeleteChat(false) }

    let btnDelete = document.querySelector('.btn-delete-chat')
    btnDelete.onclick = (e) => { deleteChat() }

    function renderChatToMyView(data) {
        let main = document.querySelector('.message__chat__content')
        let div = document.createElement('div')
        div.className = 'chat chat__me'
        div.innerHTML = `<div class="avatar-sm-circle">
                            <img src="/images/default-avatar.jpg" alt="">
                        </div>
                        <div class="chat__content" data-id="${data._id}">
                           ${data.content}
                        </div>
                        <div class="operration delete-chat" data-id=" ${data._id}">
                            <i class="fas fa-trash" data-id=" ${data._id}" aria-hidden="true"></i>
                        </div>
                        <div class="chat__time">
                            ${data.time}
                        </div>`
        main.appendChild(div)
        scrollBottomChat()
    }

    //// SOCKETS //
    var socket = io(URL);
    let urlSearchParams = new URLSearchParams(window.location.search);
    let params = Object.fromEntries(urlSearchParams.entries());
    let userId = params.user
    let nameUser = params.name
    let arrUserChatRoom = []
    document.querySelector('.my__name').textContent = `Hello ${nameUser}`
    socket.on("connect", () => {
        socket.send("Connected!");
    })

    function LoginSuccess(id) {
        socket.emit("user-login", id)
    }
    LoginSuccess(userId)

    function sendMessageSocket(data) {
        socket.emit("user-chat", data)
    }

    socket.on("send-list-user-online", data => {
        var idUsers = data.map(user => user.userId)
        let users = document.querySelectorAll('.user-item')
        users.forEach(user => {
            let isOnline = false;
            idUsers.forEach(id => {
                if (id === user.getAttribute('data-id')) {
                    isOnline = true;
                }
            })
            if (isOnline && !user.closest('.online')) {
                user.classList.add = "online"
                user.className = 'user-item online'
            } else if (!isOnline && user.closest('.online')) {
                user.className = 'user-item'
            }
        })
    })

    socket.on("has-user-chat-me", data => {
        if (idUserChatNow === data.sender) {
            let main = document.querySelector('.message__chat__content')
            let div = document.createElement('div')
            div.className = 'chat chat__user'
            div.innerHTML = `<div class="avatar-sm-circle">
                                <img src="/images/default-avatar.jpg" alt="">
                            </div>
                            <div class="chat__content" data-id="${data._id}">
                                ${data.content}
                            </div>
                            <div class="chat__time">
                                ${data.time}
                            </div>`
            main.appendChild(div)
            scrollBottomChat()
        }
    })

    let isTyping = false
    let userTypingMe = []
    socket.on("user-prepare-chat-me", id => {
        userTypingMe.push(id)
        statusTyping(id)
    })
    socket.on("user-blur-chat-me", id => {
        const index = userTypingMe.findIndex(user => user === id)
        if (index !== -1) {
            userTypingMe.splice(index, 1)[0];
        }
        statusTyping()
    })

    function statusTyping(id = null) {
        if (id === idUserChatNow && isTyping == false) {
            document.querySelector('.message__chat__typing').style.display = "block"
            isTyping = true
        } else {
            document.querySelector('.message__chat__typing').style.display = "none"
            isTyping = false
        }
    }
    function sendTypingSocket() {
        socket.emit('user-typing', idUserChatNow)
    }
    function sendBlurSocket() {
        socket.emit('user-blur', idUserChatNow)
    }
    socket.on("user-delete-chat", data => {
        if (idUserChatNow === data.iduser) {
            deleteChatFromView(data.id)
        }
    })
    function deleteChatFromView(id) {
        let chatContent = document.querySelectorAll('.chat__content')
        chatContent.forEach(chat => {
            if (chat.getAttribute('data-id') === id) {
                chat.className = 'chat__content chat__deleted'
                chat.textContent = 'This message was be deleted!'
            }
        })
    }
    function sendDeleteChatSocket(id) {
        data = { id: id, user: idUserChatNow }
        socket.emit('me-delete-chat', data)
    }
    socket.on('has-user-create-room', data => {
        let main = document.querySelector('.list-room')
        let li = document.createElement('li')
        li.className = 'room-item'
        li.setAttribute('data-id', data._id)
        li.innerHTML = `<div class="user__chat">
                            <div class="avatar-lg-square">
                                <img src="/images/rooms/${data.slug}.jpg" alt="">
                            </div>
                            <div class="user__name">
                                ${data.name}
                            </div>
                        </div>`
        main.appendChild(li)

        if (document.querySelector('.no-have-any-room')) {
            document.querySelector('.no-have-any-room').style.display = 'none'
        }

        EventClickRoom()
    })
    socket.on('notify-new-room-create', data => {
        showNotifyToast(data)
    })
    function newRoomSocKet(data) {
        socket.emit('user-create-room', data)
    }
    function renderChatRoomSocket(data) {
        socket.emit('user-chat-to-room', data)
    }
    socket.on('has-user-chat-to-room', data => {
        if (idRoomClicked === data.idroom) {
            insertChatRoom(data)
        } else {
            //alert('kh nen chen')
        }
    })

    let inputChatRoom = document.getElementById('text-message-room')
    inputChatRoom.onfocus = (e) => {
        socket.emit('user-focus-input-chat-room', { name: nameUser, room: idRoomClicked, id: userId })
    }
    inputChatRoom.onblur = (e) => {
        socket.emit('user-blur-input-chat-room', { name: nameUser, room: idRoomClicked, id: userId })
    }

    socket.on('has-user-blur-input-chat-room', data => {
        const index = arrUserChatRoom.findIndex(user => user.id === data.id)
        if (index !== -1) {
            arrUserChatRoom.splice(index, 1)[0];
        }
        if (data.room === idRoomClicked) {
            renderTypingChatRoom(data.room)
        }
    })
    socket.on('has-user-prepare-chat-to-room', data => {
        arrUserChatRoom.push(data)
        if (data.room === idRoomClicked) {
            renderTypingChatRoom(data.room)
        }
    })

    socket.on('has-user-create-account', data => {
        let ul = document.querySelector('.list-user')
        let li = document.createElement('li')
        li.className = 'user-item'
        li.setAttribute('data-id', data.id)
        li.innerHTML = `<div class="user__chat">
                            <div class="avatar-lg-square">
                                <img src="/images/default-avatar.jpg" alt="">
                            </div>
                            <div class="user__name">
                                ${data.name}
                            </div>
                        </div>`
        ul.appendChild(li)
        if (document.getElementById('no-one-person')) {
            document.getElementById('no-one-person').style.display = 'none'
        }
        showNotifyToast('Someone just created an account!')
    })

    function renderTypingChatRoom(idroom) {
        let text = ''
        arrUserChatRoom.forEach(us => {
            if (us.room === idroom) {
                if (text !== '') {
                    text += ',' + us.name
                } else {
                    text += us.name
                }
            }
        })
        if (text !== '') {
            document.querySelector('.name__user__typing').innerHTML = text
            document.querySelector('.message__chat__typing__room').style.display = 'block'
        } else {
            document.querySelector('.message__chat__typing__room').style.display = 'none'
        }
    }
    // ROOM
    let btnCreateRoom = document.getElementById('btn-create-room')
    let roomNameBox = document.getElementById('roomname')
    let hasImg = false
    let roomClicked
    let idRoomClicked = ''
    function changeImageRoom(e) {
        document.getElementById('img-room').src = window.URL.createObjectURL(e.files[0])
        if (e.files[0].size > 0) {
            hasImg = true
        } else {
            hasImg = false
        }
    }

    keyDownBox(roomNameBox)
    blurBox(roomNameBox)
    function validateRoom(roomName) {
        if (roomName === '') {
            showErrorToast("Please enter roomname!")
            focusBox(roomNameBox)
            return false
        }
        if (!hasImg) {
            showErrorToast("Please choosen image for room!")
            return false
        }
        return true
    }
    btnCreateRoom.onclick = (e) => {
        e.preventDefault()
        let roomName = roomNameBox.value
        if (validateRoom(roomName)) {
            createRoom();
        }
    }
    function createRoom() {
        let body = new FormData(document.getElementById('form-create-room'))
        fetch('/create-room', { method: 'post', body })
            .then(response => {
                return response.json()
            })
            .then(data => {
                if (data.success) {
                    newRoomSocKet(data.data)
                    showSuccessToast(data.message)
                } else {
                    showErrorToast(data.message)
                }
                document.querySelector('.modal_create_room').style.display = 'none'
            })
            .catch(error => {
                console.log(error)
            })
    }
    function insertChatRoom(data) {
        let main = document.querySelector('.message__chat__room')
        let div = document.createElement('div')
        div.className = 'chat chat__user'
        div.innerHTML = `
                        <div class="name__user__chat">${data.sendername}</div>
                        <div class="avatar-sm-circle">
                            <img src="/images/default-avatar.jpg" alt="">
                        </div>
                        <div class="chat__content">
                            ${data.content}
                        </div>
                        <div class="chat__time">
                            ${data.time}
                        </div>`
        main.appendChild(div)
    }
    EventClickRoom()
    function EventClickRoom() {
        let rooms = document.querySelectorAll('.room-item')
        rooms.forEach(room => {
            room.onclick = () => {
                idRoomClicked = room.getAttribute('data-id')
                roomClicked = room
                document.querySelector('.chat__with__room').style.display = "block"
                document.querySelector('.chat__with__user').style.display = "none"
                document.querySelector('.slect-user-to-chat').style.display = "none"
                getDataRoom()
                setDataHeaderRoom()
                renderTypingChatRoom(idRoomClicked)
                mobileResponsive()
            }
        })
    }
    let btnBackRoom = document.querySelector('.back__room')
    btnBackRoom.onclick = (e) => {
        document.querySelector('.message__user').style.display = 'flex'
        document.querySelector('.message__chat').style.display = 'none'
    }
    function setDataHeaderRoom() {
        $.ajax({
            url: '/get-name-slug-room',
            type: 'POST',
            data: { _id: idRoomClicked },
            success: function (response) {
                if (response.success) {
                    document.querySelector('.room__name__display').innerText = response.data.name
                    document.querySelector('.img__room__display').src = `/images/rooms/${response.data.slug}.jpg`
                }
            }
        })
    }

    function getDataRoom() {
        $.ajax({
            url: '/get-all-chat-room',
            type: 'POST',
            data: { id: idRoomClicked },
            success: function (response) {
                if (response.success) {
                    renderDataChatRoom(response.chats)
                }
            }
        })
    }

    function renderDataChatRoom(data) {
        let main = document.querySelector('.message__chat__room')
        main.innerHTML = ''
        data.forEach(chat => {
            let div = document.createElement('div')
            if (chat.sender !== userId) {
                div.className = 'chat chat__user'
                div.innerHTML = `
                            <div class="name__user__chat">${chat.sendername}</div>
                            <div class="avatar-sm-circle">
                                <img src="/images/default-avatar.jpg" alt="" />
                            </div>
                            <div class="chat__content">
                                ${chat.content}
                            </div>
                            <div class="chat__time">
                                ${chat.time}
                            </div>
                            `
            } else {
                div.className = 'chat chat__me'
                div.innerHTML = `
                            <div class="avatar-sm-circle">
                                <img src="/images/default-avatar.jpg" alt="" />
                            </div>
                            <div class="chat__content">
                                ${chat.content}
                            </div>
                            <div class="chat__time">
                                ${chat.time}
                            </div>
                            `
            }

            main.appendChild(div)
        })
    }

    let btnSendChatRoom = document.querySelector('.btn-send-room')
    let messageBoxRoom = document.getElementById('text-message-room')
    btnSendChatRoom.onclick = (e) => {
        e.preventDefault()
        if (messageBoxRoom.value.trim() === '') {
            showErrorToast("Please enter chat content!")
        } else {
            sendMessageToRoom(messageBoxRoom.value.trim())
            messageBoxRoom.value = ''
        }
    }
    function sendMessageToRoom(content) {
        $.ajax({
            url: '/send-message-to-room',
            type: 'POST',
            data: { idroom: idRoomClicked, sender: userId, content, sendername: nameUser },
            success: function (response) {
                if (response.success) {
                    renderNewChatRoomToMyView(response.data)
                    renderChatRoomSocket(response.data)
                }
            }
        })
    }

    function renderNewChatRoomToMyView(data) {
        let div = document.createElement('div')
        div.className = 'chat chat__me'
        div.innerHTML = `
                        <div class="avatar-sm-circle">
                            <img src="/images/default-avatar.jpg" alt="">
                        </div>
                        <div class="chat__content">
                            ${data.content}
                        </div>
                        <div class="chat__time">
                            ${data.time}
                        </div>`
        document.querySelector('.message__chat__room').appendChild(div)
    }


}

