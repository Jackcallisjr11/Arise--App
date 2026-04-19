// ⚡ WAIT UNTIL PAGE LOAD
document.addEventListener("DOMContentLoaded", function () {

  // 🔥 ELEMENTS
  const intro = document.getElementById("intro");
  const loginPage = document.getElementById("login");
  const app = document.getElementById("app");

  const startBtn = document.getElementById("startBtn");
  const loginBtn = document.getElementById("loginBtn");

  const userName = document.getElementById("userName");
  const xpText = document.getElementById("xp");

  // 🔊 AUDIO
  let bgMusic = new Audio("bg.mp3");
  let tapSound = new Audio("tap.mp3");
  let levelSound = new Audio("levelup.mp3");

  bgMusic.loop = true;

  // ⚡ GLOBAL STATE
  let currentUser = null;
  let xp = 0;
  let level = 1;

  // =========================================
  // 🔥 AUTH STATE (IMPORTANT)
  // =========================================
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      currentUser = user;
    }
  });

  // =========================================
  // ⚡ START BUTTON
  // =========================================
  if(startBtn){
    startBtn.addEventListener("click", () => {

      try{
        tapSound.play();
        bgMusic.play();
      }catch(e){
        console.log("Audio blocked");
      }

      intro.style.display = "none";

      if(currentUser){
        // already logged in
        app.classList.remove("hidden");
        userName.innerText = currentUser.displayName;
      }else{
        // show login
        loginPage.classList.remove("hidden");
      }

    });
  }

  // =========================================
  // ⚡ LOGIN BUTTON
  // =========================================
  if(loginBtn){
    loginBtn.onclick = () => {

      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);

    };
  }

  // =========================================
  // 🔥 HANDLE REDIRECT RESULT
  // =========================================
  firebase.auth().getRedirectResult()
  .then((result)=>{
    if(result.user){
      currentUser = result.user;

      loginPage.classList.add("hidden");
      app.classList.remove("hidden");

      userName.innerText = currentUser.displayName;
    }
  })
  .catch((error)=>{
    console.log("Login error:", error);
  });

  // =========================================
  // ⚡ XP SYSTEM
  // =========================================
  window.addXP = function(){

    let gained = 10;
    xp += gained;

    showPopup("⚡ +"+gained+" XP");

    // LEVEL SYSTEM (Tough)
    if(xp >= level * 100){
      xp = 0;
      level++;

      showPopup("🔥 LEVEL UP "+level);

      try{ levelSound.play(); }catch(e){}
    }

    xpText.innerText = xp;
  }

  // =========================================
  // ⚡ POPUP SYSTEM
  // =========================================
  function showPopup(text){

    let popup = document.getElementById("levelPopup");

    if(!popup) return;

    let txt = document.getElementById("popupText");
    txt.innerText = text;

    popup.classList.remove("hidden");

    setTimeout(()=>{
      popup.classList.add("hidden");
    },1500);
  }

  // =========================================
  // ⚡ LOGOUT
  // =========================================
  window.logout = function(){
    firebase.auth().signOut();
    location.reload();
  }

});