// FIREBASE
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

// STATE
let currentUser = null;
let xp = 0;

// START
function startApp(){
  tap.play();
  bg.play().catch(()=>{});
  document.getElementById("intro").style.display="none";

  if(currentUser){
    openApp();
  }else{
    document.getElementById("login").classList.remove("hidden");
  }
}

// LOGIN
function login(){
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

// AUTH STATE
firebase.auth().onAuthStateChanged(user=>{
  if(user){
    currentUser = user;
    openApp();
  }
});

function openApp(){
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("userName").innerText = currentUser.displayName;
}

// TASK COMPLETE
function completeTask(task){

  if(task.classList.contains("done")) return;

  task.classList.add("done");
  task.style.opacity = "0.3";

  let gain = 20;
  xp += gain;

  showPopup("⚡ +" + gain + " XP");

  updateRank();
}

// RANK SYSTEM
function updateRank(){

  let rank = "E";

  if(xp >= 500) rank = "S";
  else if(xp >= 400) rank = "A";
  else if(xp >= 300) rank = "B";
  else if(xp >= 200) rank = "C";
  else if(xp >= 100) rank = "D";

  document.getElementById("xp").innerText = xp;
  document.getElementById("rank").innerText = rank;

  if(rank !== "E"){
    levelSound.play();
  }
}

// POPUP
function showPopup(text){
  let pop = document.getElementById("popup");
  document.getElementById("popupText").innerText = text;

  pop.classList.remove("hidden");

  setTimeout(()=>{
    pop.classList.add("hidden");
  },1200);
}

// LOGOUT
function logout(){
  firebase.auth().signOut();
  location.reload();
}