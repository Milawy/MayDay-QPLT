

/// LOAD HTML PAGES ///

function openHome() {
    window.location.href = "home";
}

function openWeather() {
    window.location.href = "weather";
}

function openCovid() {
    window.location.href = "covid";
}

function openTrends() {
    window.location.href = "trends";
}

function openTransport() {
    window.location.href = "transport";
}

/// LOAD DIFFERENT PAGES INFOS ///

function loadInfos(){
    const path = window.location.pathname;
    const page = path.split("/").pop();
    let infoDiv = document.createElement('div');
    let infoContainer = document.getElementById('container-1');

    if(page === "home"){
        infoContainer.appendChild(infoDiv);
        infoDiv.innerHTML="Can put your main infos here";
    }
    else if(page === "weather"){
        infoContainer.appendChild(infoDiv);
        infoDiv.innerHTML="Sun / Rain / Cloud / Temperature";
    }
    else if(page === "covid"){
        infoContainer.appendChild(infoDiv);
        infoDiv.innerHTML="Graphs / Map";
    }
    else if(page === "trends"){
        infoContainer.appendChild(infoDiv);
        infoDiv.innerHTML="Important and viral news of the day";
    }
    else if(page === "transport"){
        infoContainer.appendChild(infoDiv);
        infoDiv.innerHTML="Bicycles / Taxis / Buses / Trains / Planes";
    }
}

/// FORM FUNCTIONS ///

function showHide(){
    const password = document.getElementById('input_mdp');
    const eye = document.getElementById('password-eye');

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
    const form = document.getElementById("login-form");
    const email = document.getElementById("email").value;
    const checkEmail = document.getElementById("check-email");
    const pattern = "^[^ ]+@[^ ]+\\.[a-z]{2,3}$";

    if(email.match(pattern)){
        form.classList.add("valid");
        form.classList.remove("invalid");
        checkEmail.innerHTML="Valid Email";
        checkEmail.style.color="#00ff00";
    }
    else{
        form.classList.remove("valid");
        form.classList.add("invalid");
        checkEmail.innerHTML="Invalid Email";
        checkEmail.style.color="#ff0000";
    }
}

/// LIGHT/DARK MODE ///

let defaultMode = "light";

function toggleMode() {
    if(localStorage.getItem("CSSMode") === "dark"){
        lightMode();
    }
    else{
        if(localStorage.getItem("CSSMode") === "light"){
            darkMode();
        }
    }
}

function lightMode(){
    document.querySelector("body").setAttribute('class', 'light-body');
    document.getElementById("mode-button").innerHTML = "&#9790;";
    localStorage.setItem("CSSMode", "light");
}

function darkMode() {
    document.querySelector("body").setAttribute('class', '');
    document.getElementById("mode-button").innerHTML = "&#9788;";
    localStorage.setItem("CSSMode", "dark");
}

function setMode(mode){
    if(mode === "light"){
        lightMode();
    }
    else if(mode === "dark"){
        darkMode();
    }
    else{
        setMode(defaultMode);
        localStorage.setItem("CSSMode", defaultMode);
    }
}

window.addEventListener("load", setMode(localStorage.getItem("CSSMode")));







