const firebaseConfig = {
  apiKey: "AIzaSyA4NopPzmu40nGCZIisles1MzPSEgyJC8Q",
  authDomain: "arise-app-5d3c3.firebaseapp.com",
  projectId: "arise-app-5d3c3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let user = null;
let data = {xp:0, level:1};

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

function startApp(){
  document.getElementById("intro").style.display="none";
  document.getElementById("login").classList.remove("hidden");
}

function login(){
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

function openApp(){
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("userName").innerText = user.displayName;
  updateUI();
}

function task(el){
  if(el.classList.contains("done")) return;

  el.classList.add("done");

  data.xp += 20;

  if(data.xp >= data.level * 100){
    data.xp = 0;
    data.level++;
  }

  updateUI();
  save();
}

function getRank(){
  if(data.level >= 5) return "S";
  if(data.level >= 4) return "A";
  if(data.level >= 3) return "B";
  if(data.level >= 2) return "C";
  return "E";
}

function updateUI(){
  document.getElementById("xp").innerText = data.xp;
  document.getElementById("level").innerText = data.level;
  document.getElementById("rank").innerText = getRank();
}

function save(){
  db.collection("users").doc(user.uid).set(data);
}

function logout(){
  firebase.auth().signOut();
  location.reload();
}