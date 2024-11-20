const API_KEY = '72MM6D63QVPBER7J'; // Your provided Alpha Vantage API key
let balance = 4391;
let profit = 8992;
let totalTrades = 154;
let totalInvestments = 7500;

// Fake profit data for the chart
const fakeProfitData = {
    dates: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    profits: [129, 426, 347, 771, 174, 83, 992] // Example fake profits over 7 days
};

function updateDashboard() {
    document.getElementById('balance').textContent = `$${balance.toLocaleString()}`;
    const profitElement = document.getElementById('profit');
    profitElement.textContent = `${profit >= 0 ? '+' : ''}$${profit.toLocaleString()}`;
    profitElement.className = profit >= 0 ? 'profit-green' : 'profit-red';

    document.getElementById('total-trades').textContent = totalTrades;
    document.getElementById('total-investments').textContent = `$${totalInvestments.toLocaleString()}`;

    renderProfitChart();
}

function renderProfitChart() {
    const ctx = document.getElementById('profitChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fakeProfitData.dates,
            datasets: [{
                label: 'Profit (Last 7 Days)',
                data: fakeProfitData.profits,
                borderColor: '#32CD32',
                backgroundColor: 'rgba(50, 205, 50, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Day' } },
                y: { title: { display: true, text: 'Profit (USD)' } }
            }
        }
    });
}

// Disable all non-dashboard links by simulating as images
document.querySelectorAll('.disabled-link').forEach(link => {
    link.onclick = (event) => event.preventDefault();
});

// Initialize dashboard data on load
updateDashboard();
