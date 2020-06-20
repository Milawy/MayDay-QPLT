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

function openProfile() {
    window.location.href = "profile";
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
        checkEmail.innerHTML="Format d'email correct";
        checkEmail.style.display="flex";
        checkEmail.style.color="#00CC00";
    }
    else{
        form.classList.remove("valid");
        form.classList.add("invalid");
        checkEmail.innerHTML="Format d'email incorrect";
        checkEmail.style.display="flex";
        checkEmail.style.color="#CC7700";
    }
}
/*
const inpPassword = document.getElementById("input_mdp")
const maj = document.querySelector(".maj")

inpPassword.addEventListener('keyup', function(event){
    const isCapsLockOn = event.getModifierState("CapsLock");
    console.log("salit")
    maj.style.display = isCapsLockOn ? 'block' : 'none';
});*/

/// CLOCK ///

function clock(){
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    hours.innerHTML = h;
    minutes.innerHTML = m;
    seconds.innerHTML = s;
}

/// CALENDAR ///

function calendar(){
    let today = new Date();
    let dayName = String(today.getDate()).padStart(1, '0');
    const dayNumber = String(today.getDate()).padStart(2, '0');
    const monthNumber = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = today.getFullYear();

    console.log("today : " + today);
    console.log("dayName : " + dayName);
}

/// WEATHER ///

function changeWeatherIcons(){
    let temperature = document.getElementById('hideValueGetter').value;
    let thermo = document.getElementById('thermo');

    console.log("temperature : " + temperature);

    if(temperature <= 5){
        thermo.innerHTML="&#xf2cb;";
        thermo.style.color="#00CCCC";
    }
    else if(temperature > 5 && temperature <= 15){
        thermo.innerHTML="&#xf2ca;";
        thermo.style.color="#00CC00";
    }
    else if(temperature > 15 && temperature <= 25){
        thermo.innerHTML="&#xf2c9;";
        thermo.style.color="#CCCC00";
    }
    else if(temperature > 25 && temperature <= 35){
        thermo.innerHTML="&#xf2c8;";
        thermo.style.color="#CC7700";
    }
    else if(temperature > 35){
        thermo.innerHTML="&#xf2c7;";
        thermo.style.color="#CC0000";
    }
    else{
        thermo.innerHTML="Not valid";
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







