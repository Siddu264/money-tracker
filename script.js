const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const addTransaction = document.getElementById('add-transaction');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const incomeTotal = amounts.filter(a => a > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expenseTotal = (amounts.filter(a => a < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

    balance.textContent = `$${total}`;
    income.textContent = `$${incomeTotal}`;
    expense.textContent = `$${expenseTotal}`;
}

function addTransactionDOM(transaction) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.category}</td>
        <td>${transaction.text}</td>
        <td class="amount ${transaction.amount < 0 ? 'expense' : ''}">$${transaction.amount.toFixed(2)}</td>
        <td><button onclick="removeTransaction(${transaction.id})">X</button></td>
    `;
    list.appendChild(tr);
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    updateUI();
}

function updateUI() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

addTransaction.addEventListener('click', () => {
    const textValue = text.value.trim();
    const amountValue = parseFloat(amount.value);
    const categoryValue = category.value;

    if (!textValue || isNaN(amountValue) || amountValue === 0) {
        alert('Please enter valid description, category, and amount.');
        return;
    }

    const transaction = {
        id: Date.now(),
        text: textValue,
        amount: amountValue * -1, // Always expense (negative)
        category: categoryValue,
        date: new Date().toISOString().split('T')[0]
    };

    transactions.push(transaction);
    updateLocalStorage();
    updateUI();
    
    text.value = '';
    amount.value = '';
    category.value = 'Food';
});

function init() {
    updateUI();
}

init();
