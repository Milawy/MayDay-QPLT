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