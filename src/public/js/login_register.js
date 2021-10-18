let TIME_VALID_COOKIE = 60 // minutes
    // JS FOR LOGIN PAGE
if(document.getElementById('login-page')){
    let usernameBox = document.getElementById('username')
    let passwordBox = document.getElementById('password')
    let btnLogin = document.getElementById('btn-login')
    keyDownBox(usernameBox, passwordBox)
    blurBox(usernameBox, passwordBox)
    btnLogin.onclick = (e)=>{
        e.preventDefault();
        let username = usernameBox.value.trim()
        let password = passwordBox.value.trim()
        if (validateLogin(username, password)){
            Login(username, password)
        }
    }

    function validateLogin(username, password){
        if(username === ''){
            focusBox(usernameBox)
            showErrorToast("Please enter a username")
            return false
        }
        if(password === ''){
            focusBox(passwordBox)
            showErrorToast("Please enter a password")
            return false
        } 
        return true
    }

    function Login(username, password){
        $.ajax({
            url: '/login',
            type: 'POST',
            data: {username, password},
            success: function(response){
                if(response.success){
                    showSuccessToast(response.message)
                    setCookie()
                    let token = response.token
                    setCookie("token", token, TIME_VALID_COOKIE)
                    window.location.href = "/home?user="+response.id;
                } else{
                    showErrorToast(response.message)
                }
            }
        })
    }

}
    // JS FOR REGISTER PAGE
else if(document.getElementById('register-page')){
    let usernameBox = document.querySelector('#username')
    let passwordBox = document.querySelector('#password')
    let repeatPasswordBox = document.querySelector('#repeated-password')
    let nameBox = document.querySelector('#name')
    keyDownBox(usernameBox, passwordBox, repeatPasswordBox, nameBox)
    blurBox(usernameBox, passwordBox, repeatPasswordBox, nameBox)
    let btnRegister = document.querySelector('#btn-register')
    btnRegister.onclick = (e)=>{
        e.preventDefault();
        let username = usernameBox.value
        let password = passwordBox.value
        let rpPass = repeatPasswordBox.value
        let name = nameBox.value
        if(validateRegister(username, password, rpPass, name)){
            Register(username, password, name)
        }
    }
    function validateRegister(username, password, rpPass, name){
        if(username === ''){
            showErrorToast("Please enter a username")
            focusBox(usernameBox)
            return false
        }
        if(password === ''){
            showErrorToast("Please enter a password")
            focusBox(passwordBox)
            return false
        }
        if(password.length < 8){
            showErrorToast("Password must be at least 8 characters")
            focusBox(passwordBox)
            return false
        }
        if(password !== rpPass){
            showErrorToast("Repeat password not match")
            focusBox(repeatPasswordBox)
            return false
        }
        if(name === ""){
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
            data: {username: username, password: password, name: name},
            success: function(response) {
                if(response.success){
                    showSuccessToast(response.message)
                    usernameBox.value = ""
                    passwordBox.value = ""
                    repeatPasswordBox.value = ""
                    nameBox.value = ""
                } else{
                    showErrorToast(response.message)
                }
            }
        })
    }
}



