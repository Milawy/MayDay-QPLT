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
        eye.innerHTML="&#xf070;";
    }
    else{
        password.setAttribute('type', 'password');
        eye.innerHTML="&#xf06e;";
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

function checkEmailProfileChange(){
    const form = document.getElementById("changeProfile");
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

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function calendar(){
    const container2 = document.getElementById('container-2');
    const month = container2.querySelector('h3');
    const days = container2.getElementsByClassName('number');

    let today = new Date();
    //let monthNumber = 3;
    //let monthDayNumber = 27;
    let monthNumber = today.getMonth() + 1; //Starts at 0
    let monthDayNumber = today.getDate(); //Starts at 1
    let year = today.getFullYear();

    days[monthDayNumber - 1].classList.add('active');

    if(daysInMonth(monthNumber, year) === 28){
        days[28].classList.add('hide');
        days[29].classList.add('hide');
        days[30].classList.add('hide');
    }
    else if(daysInMonth(monthNumber, year) === 29){
        days[28].classList.remove('hide');
        days[29].classList.add('hide');
        days[30].classList.add('hide');
    }
    else if(daysInMonth(monthNumber, year) === 30){
        days[28].classList.remove('hide');
        days[29].classList.remove('hide');
        days[30].classList.add('hide');
    }
    else if(daysInMonth(monthNumber, year) === 31){
        days[28].classList.remove('hide');
        days[29].classList.remove('hide');
        days[30].classList.remove('hide');
    }
    else{
        console.log("Error in days in month counter");
    }

    if(monthNumber === 1){
        month.innerHTML = "Janvier";
    }
    else if(monthNumber === 2){
        month.innerHTML = "Février";
    }
    else if(monthNumber === 3){
        month.innerHTML = "Mars";
    }
    else if(monthNumber === 4){
        month.innerHTML = "Avril";
    }
    else if(monthNumber === 5){
        month.innerHTML = "Mai";
    }
    else if(monthNumber === 6){
        month.innerHTML = "Juin";
    }
    else if(monthNumber === 7){
        month.innerHTML = "Juillet";
    }
    else if(monthNumber === 8){
        month.innerHTML = "Août";
    }
    else if(monthNumber === 9){
        month.innerHTML = "Septembre";
    }
    else if(monthNumber === 10){
        month.innerHTML = "Octobre";
    }
    else if(monthNumber === 11){
        month.innerHTML = "Novembre";
    }
    else if(monthNumber === 12){
        month.innerHTML = "Décembre";
    }
    else{
        month.innerHTML = "Error in month counter";
    }
}

/// WEATHER ///

function changeWeatherIcons(){
    //let temperature = 0;
    //let ressenti = 0;
    let temperature = document.getElementById('hideValueGetter').value;
    let ressenti = document.getElementById('hideValueGetter2').value;
    let thermo = document.getElementById('thermo');
    let thermoFeel = document.getElementById('thermo-feel');

    console.log("temperature : " + temperature);
    console.log("ressenti : " + ressenti);

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

    if(temperature < ressenti){
        thermoFeel.innerHTML="&#xf769;";
    }
    else if(temperature > ressenti){
        thermoFeel.innerHTML="&#xf76b;";
    }
    else if(temperature === ressenti){
        thermoFeel.innerHTML="&#xf2c9;";
    }
    else{
        thermoFeel.innerHTML="Not valid";
    }
}

/// BIRTHDAY PARSER ///

function birthdayParse(){
    let longBirthday = document.getElementById('hideValueGetter3').value;
    let birthdaySpan = document.getElementById('birthdaySpan');
    let smallerBirthday = longBirthday.split(' ');
    let monthName;

    if(smallerBirthday[1] === "Jan"){
        monthName = "janvier";
    }
    else if(smallerBirthday[1] === "Feb"){
        monthName = "février";
    }
    else if(smallerBirthday[1] === "Mar"){
        monthName = "mars";
    }
    else if(smallerBirthday[1] === "Apr"){
        monthName = "avril";
    }
    else if(smallerBirthday[1] === "May"){
        monthName = "mai";
    }
    else if(smallerBirthday[1] === "Jun"){
        monthName = "juin";
    }
    else if(smallerBirthday[1] === "Jul"){
        monthName = "juillet";
    }
    else if(smallerBirthday[1] === "Aug"){
        monthName = "août";
    }
    else if(smallerBirthday[1] === "Sep"){
        monthName = "septembre";
    }
    else if(smallerBirthday[1] === "Oct"){
        monthName = "octobre";
    }
    else if(smallerBirthday[1] === "Nov"){
        monthName = "novembre";
    }
    else if(smallerBirthday[1] === "Dec"){
        monthName = "décembre";
    }

    birthdaySpan.innerHTML = smallerBirthday[2] + " " + monthName + " " + smallerBirthday[3];
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







