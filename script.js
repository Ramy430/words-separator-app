import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey:"your-api-key",
  authDomain:"your-project.firebaseapp.com",
  projectId:"your-project-id",
  storageBucket:"your-project.appspot.com",
  messagingSenderId:"123456789",
  appId:"your-app-id"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const wordsTable = document.getElementById("wordsTable");
const searchInput = document.getElementById("search");
const suggestionsDiv = document.getElementById("suggestions");
const tausugInput = document.getElementById("tausug");
const englishInput = document.getElementById("english");
const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const notification = document.getElementById("notification");
const jumpRowInput = document.getElementById("jumpRowInput");
const jumpRowBtn = document.getElementById("jumpRowBtn");
const filterUnsavedBtn = document.getElementById("filterUnsavedBtn");
const nextUnsavedBtn = document.getElementById("nextUnsavedBtn");

const wordsCol = collection(db,"dictionary");
let allWords = [];
let editedRows = new Map();
let showingUnsavedOnly = false;
let unsavedIndex = 0;

// Notification
function showNotification(msg,isError=false){
  notification.innerHTML=msg;
  notification.className=isError?'notification error show':'notification show';
  setTimeout(()=>{notification.className='notification';},3000);
}

// Add word
addBtn.addEvent
