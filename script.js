// FIREBASE
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
bg.loop = true;

// STATE
let currentUser = null;
let userData = {xp:0, coins:0, streak:0};

// START
function startApp(){

  tap.play();
  bg.play().catch(()=>{});

  document.getElementById("intro").style.display="none";

  // 👇 directly show login
  document.getElementById("login").classList.remove("hidden");
}

// LOGIN (POPUP — FINAL FIX)
function login(){

  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
  .then(async (result)=>{

    currentUser = result.user;

    // 🔥 load data
    const doc = await db.collection("users").doc(currentUser.uid).get();

    if(doc.exists){
      userData = doc.data();
    }else{
      await db.collection("users").doc(currentUser.uid).set(userData);
    }

    openApp();

  })
  .catch((error)=>{
    console.log("Login error:", error);
    alert("Login failed");
  });
}

// OPEN APP
function openApp(){

  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  document.getElementById("userName").innerText = currentUser.displayName;

  updateUI();
}

// TASK
function completeTask(task){

  if(task.classList.contains("done")) return;

  task.classList.add("done");

  userData.xp += 20;
  userData.coins += 5;

  showPopup("+20 XP ⚡");

  updateRank();
  saveData();
}

// RANK
function updateRank(){

  let xp = userData.xp;
  let rank = "E";

  if(xp>=500) rank="S";
  else if(xp>=400) rank="A";
  else if(xp>=300) rank="B";
  else if(xp>=200) rank="C";
  else if(xp>=100) rank="D";

  document.getElementById("rank").innerText = rank;
}

// UI
function updateUI(){
  document.getElementById("xp").innerText = userData.xp;
  document.getElementById("coins").innerText = userData.coins;
  document.getElementById("streak").innerText = userData.streak;
}

// SAVE
function saveData(){
  db.collection("users").doc(currentUser.uid).set(userData);
}

// POPUP
function showPopup(text){
  let p=document.getElementById("popup");
  document.getElementById("popupText").innerText=text;
  p.classList.remove("hidden");

  setTimeout(()=>p.classList.add("hidden"),1000);
}

// LOGOUT
function logout(){
  firebase.auth().signOut();
  location.reload();
}