// --- 1. Canvas Interactive Background Animation ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? 'rgba(255, 183, 3, ' : 'rgba(0, 245, 212, ';
        this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 70; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// --- 2. Sticky Navbar Blur on Scroll ---
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- 3. Web3 / MetaMask Integration ---
let currentAccount = null;

async function connectWallet() {
    const btnText = document.getElementById('btnWalletText');
    if (!window.ethereum) {
        showToast("Wallet EVM tidak terdeteksi. Silakan buka MetaMask.");
        window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer');
        return;
    }
    try {
        btnText.innerText = "Menghubungkan...";
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || !accounts.length) throw new Error('Akun wallet tidak tersedia');
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x1') {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1' }]
                });
            } catch (switchError) {
                btnText.innerText = "Hubungkan Wallet";
                showToast("Pilih jaringan Ethereum Mainnet di wallet Anda.");
                return;
            }
        }
        currentAccount = accounts[0];
        const shortAddr = currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4);
        btnText.innerText = shortAddr;
        showToast("Wallet terhubung di Ethereum: " + shortAddr);
        const balanceWei = await window.ethereum.request({
            method: 'eth_getBalance', params: [currentAccount, 'latest']
        });
        const balanceEth = Number(BigInt(balanceWei)) / 1e18;
        document.getElementById('userBalanceBNB').innerText = balanceEth.toFixed(5);
        document.getElementById('userBalanceSemar').innerText = "—";
    } catch (error) {
        btnText.innerText = "Hubungkan Wallet";
        showToast(error?.message || "Gagal menghubungkan wallet.");
    }
}

if (window.ethereum) {
    window.ethereum.on?.('accountsChanged', (accounts) => {
        currentAccount = accounts?.[0] || null;
        const btnText = document.getElementById('btnWalletText');
        if (!currentAccount) {
            btnText.innerText = 'Hubungkan Wallet';
            document.getElementById('userBalanceBNB').innerText = '—';
        } else {
            btnText.innerText = currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4);
        }
    });
    window.ethereum.on?.('chainChanged', () => window.location.reload());
}

// --- 4. Chart.js Implementation ---
const chartCtx = document.getElementById('cryptoChart').getContext('2d');

const gradient = chartCtx.createLinearGradient(0, 0, 0, 300);
gradient.addColorStop(0, 'rgba(255, 183, 3, 0.4)');
gradient.addColorStop(1, 'rgba(255, 183, 3, 0.0)');

const dummyDataSets = {
    '1H': {
        labels: ['10m', '20m', '30m', '40m', '50m', '60m'],
        data: [0.00004120, 0.00004150, 0.00004110, 0.00004180, 0.00004200, 0.00004218]
    },
    '24H': {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        data: [0.00003500, 0.00003620, 0.00003480, 0.00003900, 0.00004100, 0.00004050, 0.00004218]
    },
    '7D': {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ming'],
        data: [0.00002100, 0.00002500, 0.00002800, 0.00003200, 0.00003100, 0.00003800, 0.00004218]
    },
    '1M': {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        data: [0.00001000, 0.00001800, 0.00002900, 0.00004218]
    }
};

let cryptoChart = new Chart(chartCtx, {
    type: 'line',
    data: {
        labels: dummyDataSets['24H'].labels,
        datasets: [{
            label: 'Harga $SEMAR (USD)',
            data: dummyDataSets['24H'].data,
            borderColor: '#ffb703',
            borderWidth: 3,
            fill: true,
            backgroundColor: gradient,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#00f5d4'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#a0aec0' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#a0aec0' }
            }
        }
    }
});

function updateChart(timeframe, e) {
    document.querySelectorAll('.tf-btn').forEach(btn => btn.classList.remove('active'));
    if (e && e.target) {
        e.target.classList.add('active');
    }

    cryptoChart.data.labels = dummyDataSets[timeframe].labels;
    cryptoChart.data.datasets[0].data = dummyDataSets[timeframe].data;
    cryptoChart.update();
}

// Tokenomics Donut Chart
const tokenomicsCtx = document.getElementById('tokenomicsChart').getContext('2d');
new Chart(tokenomicsCtx, {
    type: 'doughnut',
    data: {
        labels: ['Public Liquidity (DEX)', 'Komunitas & Staking', 'Pemasaran & Partnership', 'Tim & Pengembang'],
        datasets: [{
            data: [60, 20, 12, 8],
            backgroundColor: ['#ffb703', '#00f5d4', '#ff4d6d', '#7209b7'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#f8f9fa', font: { family: 'Plus Jakarta Sans', size: 12 } }
            }
        },
        cutout: '70%'
    }
});

// --- 5. Uniswap V3 Swap handoff (Ethereum Mainnet) ---
const SEMAR_TOKEN_ADDRESS = '0xc0FAE1530600AF51944705296fd79d2faF5E83DF';
let swapDirection = 'ETH_TO_SEMAR';

function calculateSwap() {
    const output = document.getElementById('getAmount');
    if (output) output.value = 'Lihat estimasi di Uniswap';
}

function switchTokens() {
    swapDirection = swapDirection === 'ETH_TO_SEMAR' ? 'SEMAR_TO_ETH' : 'ETH_TO_SEMAR';
    const payLabel = document.querySelector('#swap .input-group:first-child .input-header span:first-child');
    const receiveLabel = document.querySelectorAll('#swap .input-group')[1]?.querySelector('.input-header span:first-child');
    const payToken = document.querySelector('#swap .input-group:first-child .token-select');
    const receiveToken = document.querySelectorAll('#swap .input-group')[1]?.querySelector('.token-select');
    const payAmount = document.getElementById('payAmount');
    const getAmount = document.getElementById('getAmount');
    if (swapDirection === 'SEMAR_TO_ETH') {
        if (payLabel) payLabel.textContent = 'Anda Bayar';
        if (receiveLabel) receiveLabel.textContent = 'Anda Terima';
        if (payToken) payToken.textContent = '🗿 SEMAR';
        if (receiveToken) receiveToken.textContent = 'ETH';
        if (payAmount) payAmount.placeholder = 'Jumlah SEMAR';
        if (getAmount) getAmount.value = 'Lihat estimasi di Uniswap';
    } else {
        if (payToken) payToken.textContent = 'ETH';
        if (receiveToken) receiveToken.textContent = '🗿 SEMAR';
        if (payAmount) payAmount.placeholder = 'Jumlah ETH';
        if (getAmount) getAmount.value = 'Lihat estimasi di Uniswap';
    }
}

function executeSwap() {
    const amount = document.getElementById('payAmount')?.value?.trim();
    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
        showToast('Masukkan jumlah swap yang valid.');
        return;
    }
    const inputCurrency = swapDirection === 'ETH_TO_SEMAR' ? 'NATIVE' : SEMAR_TOKEN_ADDRESS;
    const outputCurrency = swapDirection === 'ETH_TO_SEMAR' ? SEMAR_TOKEN_ADDRESS : 'NATIVE';
    const url = new URL('https://app.uniswap.org/swap');
    url.searchParams.set('chain', 'mainnet');
    url.searchParams.set('inputCurrency', inputCurrency);
    url.searchParams.set('outputCurrency', outputCurrency);
    // Uniswap performs live quoting, routing, approval and transaction confirmation.
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
}

// --- 6. Utilities ---
function copyContract() {
    const contractAddr = document.getElementById('contractAddr').innerText;
    navigator.clipboard.writeText(contractAddr);
    showToast("Alamat Kontrak Berhasil Disalin!");
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
