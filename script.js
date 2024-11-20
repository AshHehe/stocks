const API_KEY = '72MM6D63QVPBER7J'; // Replace with your Alpha Vantage API key
let balance = 4591;
let profit = 8662;

function updateDashboard() {
    document.getElementById('balance').textContent = `$${balance.toLocaleString()}`;
    const profitElement = document.getElementById('profit');
    profitElement.textContent = `${profit >= 0 ? '+' : ''}$${profit.toLocaleString()}`;
    profitElement.className = profit >= 0 ? 'profit-green' : 'profit-red';
}

function fetchStockData() {
    const symbol = document.getElementById('stock-symbol').value.toUpperCase();

    if (!symbol) {
        alert('Please enter a valid stock symbol.');
        return;
    }

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data['Error Message']) {
                alert('Invalid stock symbol. Please try again.');
                return;
            }

            const timeSeries = data['Time Series (Daily)'];
            const dates = Object.keys(timeSeries).slice(0, 7).reverse(); // Get the last 7 days
            const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

            renderChart(symbol, dates, prices);
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
            alert('Failed to fetch stock data. Please try again later.');
        });
}

function renderChart(symbol, dates, prices) {
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
                x: {
                    title: { display: true, text: 'Date' },
                },
                y: {
                    title: { display: true, text: 'Price (USD)' },
                },
            },
        },
    });
}

// Initialize the dashboard
updateDashboard();
