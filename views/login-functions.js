const password = document.getElementById('password');
const eye = document.getElementById('password-eye');

function showHide(){
    if(password.type === 'password'){
        password.setAttribute('type', 'text');
        eye.classList.add('hide');
    }
    else{
        password.setAttribute('type', 'password');
        eye.classList.remove('hide');
    }
}

function checkEmail(){
    //const form = document.getElementById("login-form");
    const email = document.getElementById("email").value;
    const checkEmail = document.getElementById("checkEmail");
    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if(email.match(pattern)){
        /*form.classList.add("valid");
        form.classList.remove("invalid");*/
        console.log("BON");
        checkEmail.innerHTML="Valid Email";
        checkEmail.style.color="#00ff00";
    }
    else{
        /*form.classList.remove("valid");
        form.classList.add("invalid");*/
        console.log("PAS BON");
        checkEmail.innerHTML="Invalid Email";
        checkEmail.style.color="#ff0000";
    }
}