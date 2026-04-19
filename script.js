// WAIT UNTIL PAGE LOAD
window.onload = () => {

  // 🔥 HIDE SYSTEM POPUP AFTER 1.5s
  setTimeout(() => {
    let sys = document.getElementById("levelPopup");
    if (sys) sys.classList.add("hidden");
  }, 1500);

};

// FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyA4NopPzmu40nGCZIisles1MzPSEgyJC8Q",
  authDomain: "arise-app-5d3c3.firebaseapp.com",
  projectId: "arise-app-5d3c3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// AUDIO
let bgMusic = new Audio("bg.mp3");
let tapSound = new Audio("tap.mp3");
let levelSound = new Audio("levelup.mp3");

bgMusic.loop = true;

// START BUTTON
document.getElementById("startBtn").addEventListener("click", () => {

  tapSound.play();

  bgMusic.play().catch(()=>{});

  document.getElementById("intro").style.display = "none";
  document.getElementById("login").classList.remove("hidden");
});

// LOGIN
document.getElementById("loginBtn").onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider).then(res => {

    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    document.getElementById("userName").innerText = res.user.displayName;

  });
};

// SYSTEM
let xp = 0;
let level = 1;
let currentTask = "";

// TASK OPEN
function openTask(type) {

  currentTask = type;

  document.getElementById("taskPopup").classList.remove("hidden");

  if(type==="water"){
    setTask("Drink Water 💧","+10 XP per liter");
  }
  if(type==="wakeup"){
    setTask("Wake Up 🌅","+30 XP");
  }
  if(type==="study"){
    setTask("Study 📚","+20 XP/hour");
  }
}

function setTask(title,gain){
  document.getElementById("taskTitle").innerText=title;
  document.getElementById("gainText").innerText=gain;
}

// COMPLETE
function completeTask(){

  let val = document.getElementById("taskInput").value || 1;
  let gained = 0;

  if(currentTask==="water") gained = val*10;
  if(currentTask==="wakeup") gained = 30;
  if(currentTask==="study") gained = val*20;

  xp += gained;

  showPopup("QUEST COMPLETE +" + gained + " XP");

  if(xp >= level*100){
    xp = 0;
    level++;
    showPopup("⚡ LEVEL UP " + level);
    levelSound.play();
  }

  document.getElementById("xp").innerText = xp;
  document.getElementById("lvl").innerText = level;

  document.getElementById("taskPopup").classList.add("hidden");
}

// POPUP
function showPopup(text){

  let popup = document.getElementById("levelPopup");

  document.getElementById("popupText").innerText = text;

  popup.classList.remove("hidden");

  setTimeout(()=>{
    popup.classList.add("hidden");
  },1500);
}