// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyA4NopPzmu40nGCZIisles1MzPSEgyJC8Q",
  authDomain: "arise-app-5d3c3.firebaseapp.com",
  projectId: "arise-app-5d3c3"
};

firebase.initializeApp(firebaseConfig);

// STATE
let currentUser = null;
let xp = 0;

// 🔥 AUTH LISTENER (MAIN FIX)
firebase.auth().onAuthStateChanged(function(user){

  if(user){
    currentUser = user;

    document.getElementById("intro").style.display="none";
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    document.getElementById("userName").innerText = user.displayName;
  }

});

// START
function startApp(){

  document.getElementById("intro").style.display="none";

  if(currentUser){
    document.getElementById("app").classList.remove("hidden");
  }else{
    document.getElementById("login").classList.remove("hidden");
  }

}

// LOGIN (REDIRECT — SAFE)
function login(){

  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithRedirect(provider);

}

// XP
function addXP(){
  xp += 10;
  document.getElementById("xp").innerText = xp;
}

// LOGOUT
function logout(){
  firebase.auth().signOut();
  location.reload();
}