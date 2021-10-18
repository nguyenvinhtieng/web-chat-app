var socket = io("http://localhost:3000");

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
let userId = params.user

LoginSuccess(userId)

socket.on("connect", () => {
  socket.send("Hello!");
})

socket.on("send-list-user-online", data=>{
    var idUsers = data.map(user=> user.userId)
    let users = document.querySelectorAll('.user-item')
    users.forEach(user=>{
        let isOnline = false;
        idUsers.forEach(id=>{
            if(id === user.getAttribute('data-id')){
                isOnline = true;
            }
        })
        if(isOnline && !user.closest('.online')){
            user.classList.add = "online"
            user.className = 'user-item online'
        } else if(!isOnline && user.closest('.online')) {
            user.className = 'user-item'
        }
    })
})

function LoginSuccess(id){
    socket.emit("user-login", id)
}

function sendMessageSocket(data){
   socket.emit("user-chat", data)
}

socket.on("has-user-chat-me", data =>{
    if(idUserChatNow === data.sender){
        console.log("Render chat")
    } else {
        console.log("khong render chat")
    }
})
