// 1) YOUR FIREBASE CONFIG
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
const transactionsRef = db.ref('transactions');

// 3) DOM REFERENCES
const balance = document.getElementById('balance');
const expense = document.getElementById('expense');
const list = document.getElementById('list');

const mainCategory = document.getElementById('main-category');
const subCategory = document.getElementById('sub-category');
const subCategoryOther = document.getElementById('sub-category-other');

const text = document.getElementById('text');
const amount = document.getElementById('amount');
const addTransaction = document.getElementById('add-transaction');

// In-memory cache
let transactions = [];

// ----- CATEGORY / SUBCATEGORY LOGIC -----

function setSubcategoryOptions() {
  const value = mainCategory.value;

  // reset both controls
  subCategory.style.display = 'block';
  subCategoryOther.style.display = 'none';
  subCategory.innerHTML = '';

  if (value === 'Me') {
    // Me -> Siddu
    const opt = document.createElement('option');
    opt.value = 'Siddu';
    opt.textContent = 'Siddu';
    subCategory.appendChild(opt);
    subCategory.value = 'Siddu';
  } else if (value === 'Family') {
    // Family -> Father/Mother/Brother/Sister
    const familyMembers = ['Father', 'Mother', 'Brother', 'Sister'];
    familyMembers.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      subCategory.appendChild(opt);
    });
    // no default selection; user must choose
    subCategory.value = '';
  } else if (value === 'Other') {
    // Other -> free text only
    subCategory.style.display = 'none';
    subCategoryOther.style.display = 'block';
    subCategoryOther.value = '';   // clear previous text
  }
}

// run once on load
setSubcategoryOptions();

// update when main category changes
mainCategory.addEventListener('change', setSubcategoryOptions);

// ----- FIREBASE LISTENER -----

transactionsRef.on('value', snapshot => {
  const data = snapshot.val() || {};
  transactions = Object.keys(data).map(key => ({
    id: key,
    ...data[key],
  }));
  updateUI();
});

// ----- CALCULATIONS -----

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

  // we store all expenses as negative, so total is negative
  const expenseTotal = (-1 * total).toFixed(2);

  balance.textContent = `$${total}`;
  expense.textContent = `$${expenseTotal}`;
}

// ----- RENDERING -----

function addTransactionDOM(transaction) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${transaction.date}</td>
    <td>${transaction.mainCategory}</td>
    <td>${transaction.subCategory}</td>
    <td>${transaction.text}</td>
    <td class="amount expense">
      $${(-transaction.amount).toFixed(2)}
    </td>
  `;
  list.appendChild(tr);
}

function updateUI() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// ----- ADD EXPENSE -----

addTransaction.addEventListener('click', () => {
  const mainCat = mainCategory.value;
  let subCat = '';

  if (mainCat === 'Other') {
    subCat = subCategoryOther.value.trim();
  } else {
    subCat = subCategory.value;
  }

  const textValue = text.value.trim();
  const amountValue = parseFloat(amount.value);

  if (!mainCat || !subCat || !textValue || isNaN(amountValue) || amountValue <= 0) {
    alert('Please enter valid category, subcategory, description, and amount.');
    return;
  }

  const transaction = {
    main
