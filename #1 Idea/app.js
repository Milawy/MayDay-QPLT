function openTabs() {
    document.getElementById("side-bar").style.display = "flex";
    document.getElementById("side-bar").style.flexDirection = "column";
    document.getElementById("side-bar-button").style.display = 'none';
}

function closeTabs() {
    document.getElementById("side-bar").style.display = "none";
    document.getElementById("side-bar-button").style.display = "flex";
}

function openHome() {
    window.location.href = "display.html";
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