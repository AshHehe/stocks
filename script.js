const API_KEY = '72MM6D63QVPBER7J'; // Replace with your Alpha Vantage API key
let balance = 10000;
let profit = 1200;

// Example list of popular stocks for suggestions
const stockList = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NFLX', 'FB', 'NVDA', 'BABA', 'DIS'];

function updateDashboard() {
    document.getElementById('balance').textContent = `$${balance.toLocaleString()}`;
    const profitElement = document.getElementById('profit');
    profitElement.textContent = `${profit >= 0 ? '+' : ''}$${profit.toLocaleString()}`;
    profitElement.className = profit >= 0 ? 'profit-green' : 'profit-red';
}

function showPage(page) {
    document.getElementById('dashboard').style.display = page === 'dashboard' ? 'block' : 'none';
    document.getElementById('buy-sell').style.display = page === 'buy-sell' ? 'block' : 'none';
}

function suggestStocks() {
    const input = document.getElementById('stock-symbol').value.toUpperCase();
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    if (input) {
        stockList
            .filter(stock => stock.startsWith(input))
            .forEach(stock => {
                const li = document.createElement('li');
                li.textContent = stock;
                li.onclick = () => {
                    document.getElementById('stock-symbol').value = stock;
                    suggestions.innerHTML = '';
                };
                suggestions.appendChild(li);
            });
    }
}

function fetchStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data['Error Message']) {
                throw new Error('Invalid stock symbol.');
            }
            return data['Time Series (Daily)'];
        });
}

function renderChart(symbol, timeSeries) {
    const dates = Object.keys(timeSeries).slice(0, 7).reverse();
    const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
    const ctx = document.getElementById('stockChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: `${symbol} Stock Price (Last 7 Days)`,
                    data: prices,
                    borderColor: '#6a1b9a',
                    backgroundColor: 'rgba(106, 27, 154, 0.1)',
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Price (USD)' } },
            },
        },
    });
}

function buyStock() {
    const symbol = document.getElementById('stock-symbol').value.toUpperCase();
    const amount = parseFloat(document.getElementById('amount').value);

    if (!symbol || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid stock symbol and amount.');
        return;
    }

    fetchStockData(symbol)
        .then(timeSeries => {
            const latestPrice = parseFloat(Object.values(timeSeries)[0]['4. close']);
            const cost = latestPrice * amount;
            if (balance < cost) {
                alert('Insufficient balance to buy stocks.');
                return;
            }

            balance -= cost;
            profit += Math.random() * cost * 0.1; // Simulate profit
            updateDashboard();
            renderChart(symbol, timeSeries);
            alert(`You bought ${amount} shares of ${symbol} for $${cost.toFixed(2)}.`);
        })
        .catch(error => alert(error.message));
}

function sellStock() {
    const symbol = document.getElementById('stock-symbol').value.toUpperCase();
    const amount = parseFloat(document.getElementById('amount').value);

    if (!symbol || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid stock symbol and amount.');
        return;
    }

    fetchStockData(symbol)
        .then(timeSeries => {
            const latestPrice = parseFloat(Object.values(timeSeries)[0]['4. close']);
            const revenue = latestPrice * amount;

            balance += revenue;
            profit += Math.random() * revenue * 0.1; // Simulate profit
            updateDashboard();
            renderChart(symbol, timeSeries);
            alert(`You sold ${amount} shares of ${symbol} for $${revenue.toFixed(2)}.`);
        })
        .catch(error => alert(error.message));
}

// Initialize
updateDashboard();
