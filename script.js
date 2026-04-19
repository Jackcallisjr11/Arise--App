const firebaseConfig = {
  apiKey: "AIzaSyA4NopPzmu40nGCZIisles1MzPSEgyJC8Q",
  authDomain: "arise-app-5d3c3.firebaseapp.com",
  projectId: "arise-app-5d3c3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// AUDIO
let bg = new Audio("bg.mp3");
let tap = new Audio("tap.mp3");
let level = new Audio("levelup.mp3");

bg.loop = true;

// STATE
let user = null;
let data = {xp:0, level:1};

// AUTH
firebase.auth().onAuthStateChanged(async u=>{
  if(u){
    user = u;

    const ref = db.collection("users").doc(user.uid);
    const doc = await ref.get();

    if(doc.exists){
      data = doc.data();
    }else{
      await ref.set(data);
    }

    openApp();
  }
});

// START
function startApp(){
  tap.play();
  bg.play().catch(()=>{});

  document.getElementById("intro").style.display="none";
  document.getElementById("login").classList.remove("hidden");
}

// LOGIN
function login(){
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

// OPEN APP
function openApp(){
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  document.getElementById("userName").innerText = user.displayName;
  updateUI();
}

// TASK SYSTEM
let currentXP = 0;

function openTask(name,xp){
  currentXP = xp;

  document.getElementById("taskTitle").innerText = name;
  document.getElementById("taskXP").innerText = "+" + xp + " XP";

  document.getElementById("taskPopup").classList.remove("hidden");
}

function completeTask(){

  document.getElementById("taskPopup").classList.add("hidden");

  data.xp += currentXP;

  if(data.xp >= data.level * 100){
    data.xp = 0;
    data.level++;

    level.play();

    document.getElementById("levelPopup").classList.remove("hidden");
    setTimeout(()=>{
      document.getElementById("levelPopup").classList.add("hidden");
    },1500);
  }

  updateUI();
  save();
}

// RANK
function getRank(){
  if(data.level>=5) return "S";
  if(data.level>=4) return "A";
  if(data.level>=3) return "B";
  if(data.level>=2) return "C";
  return "E";
}

// UI
function updateUI(){
  document.getElementById("xp").innerText = data.xp;
  document.getElementById("level").innerText = data.level;
  document.getElementById("rank").innerText = getRank();
}

// SAVE
function save(){
  db.collection("users").doc(user.uid).set(data);
}

// LOGOUT
function logout(){
  firebase.auth().signOut();
  location.reload();
}