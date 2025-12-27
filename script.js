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

// 3) DOM REFERENCES (ids must match index.html)
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const addTransaction = document.getElementById('add-transaction');

// In‑memory cache of transactions
let transactions = [];

// 4) LISTEN TO FIREBASE CHANGES
transactionsRef.on('value', snapshot => {
  const data = snapshot.val() || {};
  transactions = Object.keys(data).map(key => ({
    id: key,
    ...data[key],
  }));
  updateUI();
});

// 5) UPDATE TOTALS
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const incomeTotal = amounts
    .filter(a => a > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
  const expenseTotal = (
    amounts.filter(a => a < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.textContent = `$${total}`;
  income.textContent = `$${incomeTotal}`;
  expense.textContent = `$${expenseTotal}`;
}

// 6) RENDER ONE ROW
function addTransactionDOM(transaction) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${transaction.date}</td>
    <td>${transaction.category}</td>
    <td>${transaction.text}</td>
    <td class="amount ${transaction.amount < 0 ? 'expense' : ''}">
      $${transaction.amount.toFixed(2)}
    </td>
    <td><button data-id="${transaction.id}" class="delete-btn">X</button></td>
  `;
  list.appendChild(tr);
}

// 7) RENDER ALL + TOTALS
function updateUI() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// 8) ADD TRANSACTION (WRITE TO FIREBASE)
addTransaction.addEventListener('click', () => {
  const textValue = text.value.trim();
  const amountValue = parseFloat(amount.value);
  const categoryValue = category.value;

  if (!textValue || isNaN(amountValue) || amountValue === 0) {
    alert('Please enter valid description, category, and amount.');
    return;
  }

  const transaction = {
    text: textValue,
    amount: amountValue * -1, // Expense stored as negative
    category: categoryValue,
    date: new Date().toISOString().split('T')[0],
  };

  // Push to Realtime Database
  transactionsRef.push(transaction);

  // Clear inputs
  text.value = '';
  amount.value = '';
  category.value = 'Personal - Food';
});

// 9) DELETE TRANSACTION
list.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    if (id) {
      transactionsRef.child(id).remove();
    }
  }
});
