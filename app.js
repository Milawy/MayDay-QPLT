function openTabs() {
    document.getElementById("side-bar").style.display = "flex";
    document.getElementById("side-bar").style.flexDirection = "column";
    document.getElementById("side-bar-button").style.display = 'none';
}

function closeTabs() {
    document.getElementById("side-bar").style.display = "none";
    document.getElementById("side-bar-button").style.display = "flex";
}