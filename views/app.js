/// LOAD HTML PAGES ///

function openHome() {
    window.location.href = "home.html";
}

function openWeather() {
    window.location.href = "weather.html";
}

function openCovid() {
    window.location.href = "covid.html";
}

function openTrends() {
    window.location.href = "trends.html";
}

function openTransport() {
    window.location.href = "transport.html";
}

/// PROFILE CHANGE ///

Nom = 2;

function inputName() {

}

/// LIGHT/DARK MODE ///

let defaultMode = "dark";

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
    document.querySelector("body").classList.add("light-mode");
    document.getElementsByClassName("mode-button").innerHTML = "&#9790;";
    document.getElementsByClassName("mode-button").onclick = toggleMode;
    localStorage.setItem("CSSMode", "light");
}

function darkMode() {
    document.querySelector("body").classList.remove("light-mode");
    document.getElementsByClassName("mode-button").innerHTML = "&#9788;";
    document.getElementsByClassName("mode-button").onclick = toggleMode;
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