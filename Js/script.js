document.addEventListener('DOMContentLoaded', function () {
    let initialBalance = 1000000;
    let remainingBalance = initialBalance;
    const budgetForm = document.getElementById('budget-form');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const remainingBalanceElement = document.getElementById('remaining-balance');

    // Load data from localStorage
    function loadData() {
        const savedInitialBalance = localStorage.getItem('initialBalance');
        const savedRemainingBalance = localStorage.getItem('remainingBalance');
        const savedExpenses = localStorage.getItem('expenses');

        if (savedInitialBalance) {
            initialBalance = parseInt(savedInitialBalance);
        }
        if (savedRemainingBalance) {
            remainingBalance = parseInt(savedRemainingBalance);
        }
        if (savedExpenses) {
            const expenses = JSON.parse(savedExpenses);
            expenses.forEach(expense => addExpenseToDOM(expense.description, expense.date, expense.amount));
        }

        updateRemainingBalance();
    }

    function saveData() {
        localStorage.setItem('initialBalance', initialBalance);
        localStorage.setItem('remainingBalance', remainingBalance);

        const expenses = [];
        document.querySelectorAll('#expense-list li').forEach(item => {
            const text = item.querySelector('span').innerText;
            const amount = parseInt(item.querySelector('span:nth-child(2)').innerText.replace('Rp ', '').replace(/,/g, ''));
            const [description, date] = text.split(' - ');
            expenses.push({ description, date, amount });
        });
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function updateRemainingBalance() {
        remainingBalanceElement.textContent = `Rp ${remainingBalance.toLocaleString('id-ID')}`;
    }

    function addExpenseToDOM(description, date, amount) {
        const expenseItem = document.createElement('li');
        expenseItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        expenseItem.innerHTML = `
            <span>${description} - ${date}</span>
            <span>Rp ${amount.toLocaleString('id-ID')}</span>
        `;
        expenseList.appendChild(expenseItem);
    }

    budgetForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const initialBalanceInput = document.getElementById('initial-balance').value;
        initialBalance = parseInt(initialBalanceInput);
        remainingBalance = initialBalance;
        updateRemainingBalance();
        saveData();
    });

    expenseForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const amount = parseInt(document.getElementById('amount').value);

        if (description && date && amount > 0) {
            addExpenseToDOM(description, date, amount);
            remainingBalance -= amount;
            updateRemainingBalance();
            saveData();
            expenseForm.reset();
        }
    });

    loadData();
});
