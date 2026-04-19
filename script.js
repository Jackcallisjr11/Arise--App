// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyA4NopPzmu40nGCZIisles1MzPSEgyJC8Q",
  authDomain: "arise-app-5d3c3.firebaseapp.com",
  projectId: "arise-app-5d3c3"
};

firebase.initializeApp(firebaseConfig);

// AUDIO
let bg = new Audio("bg.mp3");
let tap = new Audio("tap.mp3");
let levelSound = new Audio("levelup.mp3");

bg.loop = true;

// GLOBAL STATE
let currentUser = null;
let xp = 0;
let level = 1;

// START
function startApp(){

  tap.play();

  bg.play().catch(()=>{});

  document.getElementById("intro").style.display="none";

  if(currentUser){
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("userName").innerText = currentUser.displayName;
  }else{
    document.getElementById("login").classList.remove("hidden");
  }

}

// LOGIN (REDIRECT METHOD)
function login(){
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

// AUTH STATE (IMPORTANT)
firebase.auth().onAuthStateChanged(function(user){
  if(user){
    currentUser = user;

    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    document.getElementById("userName").innerText = user.displayName;
  }
});

// XP SYSTEM
function addXP(){

  let gain = 20;

  xp += gain;

  showPopup("⚡ +" + gain + " XP");

  if(xp >= level * 100){
    xp = 0;
    level++;
    showPopup("🔥 LEVEL UP " + level);

    levelSound.play();
  }

  document.getElementById("xp").innerText = xp;
  document.getElementById("lvl").innerText = level;
}

// POPUP
function showPopup(text){

  let popup = document.getElementById("levelPopup");
  let txt = document.getElementById("popupText");

  txt.innerText = text;

  popup.classList.remove("hidden");

  setTimeout(()=>{
    popup.classList.add("hidden");
  },1500);
}

// LOGOUT
function logout(){
  firebase.auth().signOut();
  location.reload();
}