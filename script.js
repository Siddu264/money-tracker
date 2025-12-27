// 1) FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDlLtvGl76nPeYLtoBNwAzmKcdkygg9TnQ",
  authDomain: "moneytracker-5fe0c.firebaseapp.com",
  databaseURL: "https://moneytracker-5fe0c-default-rtdb.firebaseio.com",
  projectId: "moneytracker-5fe0c",
  storageBucket: "moneytracker-5fe0c.firebasestorage.app",
  messagingSenderId: "460917454334",
  appId: "1:460917454334:web:6050dbe5c9b2d109cfbcaf",
  measurementId: "G-8NDM3SFC0N"
};

// 2) INITIALIZE FIREBASE (compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const transactionsRef = db.ref("transactions");

// 3) DOM REFERENCES
const balanceEl = document.getElementById("balance");
const expenseEl = document.getElementById("expense");
const listEl = document.getElementById("list");

const mainCategoryEl = document.getElementById("main-category");
const subCategoryEl = document.getElementById("sub-category");
const subCategoryOtherEl = document.getElementById("sub-category-other");

const textEl = document.getElementById("text");
const amountEl = document.getElementById("amount");
const addTransactionBtn = document.getElementById("add-transaction");

// In‑memory cache
let transactions = [];

// -------- CATEGORY / SUBCATEGORY --------

function setSubcategoryOptions() {
  const value = mainCategoryEl.value;

  // reset both controls
  subCategoryEl.style.display = "block";
  subCategoryOtherEl.style.display = "none";
  subCategoryEl.innerHTML = "";

  if (value === "Me") {
    const opt = document.createElement("option");
    opt.value = "Siddu";
    opt.textContent = "Siddu";
    subCategoryEl.appendChild(opt);
    subCategoryEl.value = "Siddu";
  } else if (value === "Family") {
    const familyMembers = ["Father", "Mother", "Brother", "Sister"];
    familyMembers
