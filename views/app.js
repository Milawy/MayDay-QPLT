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

/// LIGHT/DARK MODE ///

let defaultMode = "dark";
let newMode;

function createModeButton(){
    newMode = getMode();
    let sideBar = document.getElementById("side-bar");
    let button = document.createElement("button");
    button.setAttribute("id", "mode-button");
    button.setAttribute("onclick", "swapMode(newMode)");
    sideBar.appendChild(button);
    setMode(newMode);
}

function lightMode(){
    newMode = "light";
    document.querySelector("link").setAttribute("href", "style-light-mode.css")
    document.getElementById("mode-button").innerHTML="&#9790;";
    document.getElementById("mode-button").onclick = darkMode;
    return newMode;
}

function darkMode(){
    newMode = "dark";
    document.querySelector("link").setAttribute("href", "style.css")
    document.getElementById("mode-button").innerHTML="&#9788;";
    document.getElementById("mode-button").onclick = lightMode;
    return newMode;
}

function setMode(){
    if(defaultMode === "light"){lightMode()}
    else if(defaultMode === "dark"){darkMode()}
    else{alert("Mode Error")}
}

function getMode(){
    if(newMode === "light" || newMode === "dark"){return newMode}
    else{return defaultMode}
}

function swapMode(newMode){
    if(newMode === "light"){
        defaultMode = newMode;
        darkMode()
    }
    else if(newMode === "dark"){
        defaultMode = newMode;
        lightMode()
    }
    else{alert("Swap Mode Error")}
}

window.addEventListener("load", createModeButton);