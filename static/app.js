/// GENERATING HTML ///

// For app pages
// in body
// <div class="main">
//
//     <div class="side-bar">
//         <div class="tabs">
//             <img src="./resources/defaultProfilePic.png" onclick="window.location.href='profile.html';" alt="">
//             <hr>
//             <div onclick="openHome()">HOME</div>
//             <div onclick="openWeather()">WEATHER</div>
//             <div onclick="openCovid()">COVID-19</div>
//             <div onclick="openTrends()">TRENDS</div>
//             <div onclick="openTransport()">PUBLIC TRANSPORT</div>
//         </div>
//         <hr>
//         <button id="mode-button" onclick="toggleMode()"></button>
//     </div>
//
//     <div class="container-1">
//         <div>Can put your main infos here</div> On changera ce innerHTML grace au pageName
//     </div>
//
//     <div class="social-buttons">
//         <a href="https://www.facebook.com/" class="fa fa-facebook"></a>
//         <a href="https://twitter.com/home" class="fa fa-twitter"></a>
//         <a href="https://www.instagram.com/" class="fa fa-instagram"></a>
//         <a href="https://www.reddit.com/" class="fa fa-reddit"></a>
//     </div>
//
// </div>

function generatePages(pageName){

}

// For profile
// in body
// <div class="main">
//
//     <div class="side-bar">
//         <div class="tabs">
//             <img src="./resources/defaultProfilePic.png" onclick="window.location.href='profile.html';" alt="">
//             <hr>
//             <div onclick="openHome()">HOME</div>
//             <div onclick="openWeather()">WEATHER</div>
//             <div onclick="openCovid()">COVID-19</div>
//             <div onclick="openTrends()">TRENDS</div>
//             <div onclick="openTransport()">PUBLIC TRANSPORT</div>
//         </div>
//         <hr>
//         <button id="mode-button" onclick="toggleMode()"></button>
//     </div>
//
//     <div class="profile-bar">
//         <h1>PROFILE</h1>
//         <div onclick="inputName()">Name :</div>
//         <div onclick="">Surname :</div>
//         <div onclick="">Age :</div>
//         <div onclick="">Birthday :</div>
//         <img src="./resources/defaultProfilePic.png" onclick="window.location.href='profile.html';" alt="">
//     </div>
//
// </div>

function generateProfile(){

}

function generateLogin(){
    let loginBody = document.body;
    let newForm = document.createElement('form');
    let newH2 = document.createElement('h2');
    let newDiv1 = document.createElement('div');
    let newDiv2 = document.createElement('div');
    let newDiv3 = document.createElement('div');
    let newDiv4 = document.createElement('div');
    let newLabel1 = document.createElement('label');
    let newLabel2 = document.createElement('label');
    let newInput1 = document.createElement('input');
    let newInput2 = document.createElement('input');
    let newInput3 = document.createElement('input');
    let newInput4 = document.createElement('input');
    let newSpan1 = document.createElement('span');
    let newSpan2 = document.createElement('span');
    let newA = document.createElement('a');
    let newHr = document.createElement('hr');

    loginBody.appendChild(newForm);
    newForm.id="login-form";
    newForm.action="home.html";

    newForm.appendChild(newH2);
    newH2.innerHTML="Log in";

    newForm.appendChild(newDiv1);
    newDiv1.classList.add('form-input');
    newDiv1.id="email-div";
    newDiv1.appendChild(newLabel1);
    newDiv1.appendChild(newSpan1);
    newLabel1.appendChild(newInput1);
    newInput1.id="email";
    newInput1.type="text";
    newInput1.placeholder="Email";
    newInput1.required=true;
    newInput1.setAttribute('onchange', 'checkEmail()');
    newSpan1.id="check-email";

    newForm.appendChild(newDiv2);
    newDiv2.classList.add('form-input');
    newDiv2.id="password-div";
    newDiv2.appendChild(newLabel2);
    newDiv2.appendChild(newSpan2);
    newLabel2.appendChild(newInput2);
    newInput2.id="password";
    newInput2.type="password";
    newInput2.placeholder="Password";
    newInput2.required=true;
    newSpan2.id="password-eye";
    newSpan2.setAttribute('onclick', 'showHide()');

    newForm.appendChild(newDiv3);
    newDiv3.classList.add('form-input');
    newDiv3.id="submit-div";
    newDiv3.appendChild(newInput3);
    newInput3.type="submit";
    newInput3.value="Submit";

    newForm.appendChild(newA);
    newA.href="#";
    newA.classList.add('forget-password');
    newA.innerHTML="Forget Password ?";

    newForm.appendChild(newHr);

    newForm.appendChild(newDiv4);
    newDiv4.classList.add('form-input');
    newDiv4.id="sign-up-div";
    newDiv4.appendChild(newInput4);
    newInput4.type="button";
    newInput4.value="Sign up";
    newInput4.setAttribute('onclick', "window.location.href='sign-up.html';")
}

function generateSignUp(){
    let signUpBody = document.body;
    let newForm = document.createElement('form');
    let newH2 = document.createElement('h2');
    let newDiv1 = document.createElement('div');
    let newDiv2 = document.createElement('div');
    let newDiv3 = document.createElement('div');
    let newDiv4 = document.createElement('div');
    let newDiv5 = document.createElement('div');
    let newDiv6 = document.createElement('div');
    let newDiv7 = document.createElement('div');
    let newLabel1 = document.createElement('label');
    let newLabel2 = document.createElement('label');
    let newLabel3 = document.createElement('label');
    let newLabel4 = document.createElement('label');
    let newLabel5 = document.createElement('label');
    let newInput1 = document.createElement('input');
    let newInput2 = document.createElement('input');
    let newInput3 = document.createElement('input');
    let newInput4 = document.createElement('input');
    let newInput5 = document.createElement('input');
    let newInput6 = document.createElement('input');
    let newInput7 = document.createElement('input');
    let newSpan1 = document.createElement('span');
    let newSpan2 = document.createElement('span');
    let newHr = document.createElement('hr');

    signUpBody.appendChild(newForm);
    newForm.id="login-form";
    newForm.action="login.html";

    newForm.appendChild(newH2);
    newH2.innerHTML="Sign up";

    newForm.appendChild(newDiv1);
    newDiv1.classList.add('form-input');
    newDiv1.id="first-name-div";
    newDiv1.appendChild(newLabel1);
    newLabel1.appendChild(newInput1);
    newInput1.id="first-name";
    newInput1.type="text";
    newInput1.placeholder="First name";
    newInput1.required=true;

    newForm.appendChild(newDiv2);
    newDiv2.classList.add('form-input');
    newDiv2.id="last-name-div";
    newDiv2.appendChild(newLabel2);
    newLabel2.appendChild(newInput2);
    newInput2.id="last-name";
    newInput2.type="text";
    newInput2.placeholder="Last name";
    newInput2.required=true;

    newForm.appendChild(newDiv3);
    newDiv3.classList.add('form-input');
    newDiv3.id="email-div";
    newDiv3.appendChild(newLabel3);
    newDiv3.appendChild(newSpan1);
    newLabel3.appendChild(newInput3);
    newInput3.id="email";
    newInput3.type="email";
    newInput3.placeholder="Email";
    newInput3.required=true;
    newInput3.setAttribute('onchange', 'checkEmail()');
    newSpan1.id="check-email";

    newForm.appendChild(newDiv4);
    newDiv4.classList.add('form-input');
    newDiv4.id="password-div";
    newDiv4.appendChild(newLabel4);
    newDiv4.appendChild(newSpan2);
    newLabel4.appendChild(newInput4);
    newInput4.id="password";
    newInput4.type="password";
    newInput4.placeholder="Password";
    newInput4.required=true;
    newSpan2.id="password-eye";
    newSpan2.setAttribute('onclick', 'showHide()');

    newForm.appendChild(newDiv5);
    newDiv5.classList.add('form-input');
    newDiv5.id="date-div";
    newDiv5.appendChild(newLabel5);
    newLabel5.appendChild(newInput5);
    newInput5.type="date";
    newInput5.required=true;

    newForm.appendChild(newDiv6);
    newDiv6.classList.add('form-input');
    newDiv6.id="submit-div";
    newDiv6.appendChild(newInput6);
    newInput6.type="submit";
    newInput6.value="Submit";

    newForm.appendChild(newHr);

    newForm.appendChild(newDiv7);
    newDiv7.classList.add('form-input');
    newDiv7.id="sign-up-div";
    newDiv7.appendChild(newInput7);
    newInput7.type="button";
    newInput7.value="Log in";
    newInput7.setAttribute('onclick', "window.location.href='login.html';")
}

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

function inputName() {

}

/// FORMS FUNCTIONS ///

function showHide(){
    const password = document.getElementById('password');
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
    const form = document.getElementById('login-form');
    const email = document.getElementById('email').value;
    const checkEmail = document.getElementById('check-email');
    const pattern = "^[^ ]+@[^ ]+\\.[a-z]{2,3}$";

    if(email.match(pattern)){
        form.classList.add('valid');
        form.classList.remove('invalid');
        checkEmail.innerHTML="Valid email";
        checkEmail.style.color="#00ff00";
    }
    else{
        form.classList.remove('valid');
        form.classList.add('invalid');
        checkEmail.innerHTML="Invalid email";
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