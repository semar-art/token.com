const CONFIG = {
  CONTRACT_ADDRESS: '0xc0FAE1530600AF51944705296fd79d2faF5E83DF',
  DEX_CHAIN: 'polygon',
  DEX_PAIR_ADDRESS: '',
  DEX_EMBED_BASE: 'https://dexscreener.com',
  // Jika ingin memaksa jaringan tertentu, isi chain ID heksadesimal. Kosong = tidak memaksa.
  REQUIRED_CHAIN_ID: ''
};
let currentAccount=null, toastTimer;
const $=id=>document.getElementById(id);
function shortAddress(a){return a?`${a.slice(0,6)}...${a.slice(-4)}`:'—'}
function showToast(m){const e=$('toast');e.textContent=m;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),3200)}
async function copyContract(){try{await navigator.clipboard.writeText(CONFIG.CONTRACT_ADDRESS);showToast((localStorage.getItem('smr-language')||'en')==='id'?'Alamat kontrak disalin!':'Contract address copied!')}catch(e){showToast((localStorage.getItem('smr-language')||'en')==='id'?'Alamat kontrak tidak dapat disalin.':'Could not copy contract address.')}}
async function getChain(){if(!window.ethereum)return null;return await window.ethereum.request({method:'eth_chainId'})}
function networkName(id){const m={'0x1':'Ethereum','0x89':'Polygon','0x38':'BNB Chain','0xa86a':'Avalanche','0xa4b1':'Arbitrum One','0xa':'Optimism','0x2105':'Base'};return m[id]||id||'Unknown'}
async function connectWallet(){
  if(!window.ethereum){showToast((localStorage.getItem('smr-language')||'en')==='id'?'Wallet EVM tidak ditemukan. Pasang MetaMask atau wallet kompatibel lainnya.':'No EVM wallet detected. Install MetaMask or another compatible wallet and try again.');return}
  try{
    $('btnWalletText').textContent=(localStorage.getItem('smr-language')||'en')==='id'?'Menghubungkan...':'Connecting...';
    const accounts=await window.ethereum.request({method:'eth_requestAccounts'});
    currentAccount=accounts[0]||null;
    await updateWalletUI();
    showToast(currentAccount?((localStorage.getItem('smr-language')||'en')==='id'?'Wallet terhubung!':'Wallet connected.'):((localStorage.getItem('smr-language')||'en')==='id'?'Wallet belum terhubung.':'Wallet not connected.'));
  }catch(err){$('btnWalletText').textContent=(localStorage.getItem('smr-language')||'en')==='id'?'Hubungkan Wallet':'Connect Wallet';showToast(err?.message||((localStorage.getItem('smr-language')||'en')==='id'?'Koneksi wallet dibatalkan.':'Wallet connection cancelled.'))}
}
async function updateWalletUI(){
  const id=await getChain();
  $('btnWalletText').textContent=currentAccount?shortAddress(currentAccount):'Connect Wallet';
  $('walletNetwork').textContent=currentAccount?`Wallet: ${networkName(id)}`:((localStorage.getItem('smr-language')||'en')==='id'?'Wallet: belum terhubung':'Wallet: not connected');
  if(currentAccount)await refreshWalletBalance();else{$('userBalanceBNB').textContent='—';$('userBalanceSemar').textContent='—'}
}
async function refreshWalletBalance(){
  if(!currentAccount||!window.ethereum)return;
  try{const hex=await window.ethereum.request({method:'eth_getBalance',params:[currentAccount,'latest']});$('userBalanceBNB').textContent=(Number(BigInt(hex))/1e18).toFixed(4)}catch(e){$('userBalanceBNB').textContent='—'}
  $('userBalanceSemar').textContent='—';
}
function buildDexUrl(){return CONFIG.DEX_PAIR_ADDRESS?`${CONFIG.DEX_EMBED_BASE}/${CONFIG.DEX_CHAIN}/${CONFIG.DEX_PAIR_ADDRESS}`:''}
function setupDex(){const wrap=$('dexFrameWrap'),link=$('dexLink'),status=$('dexStatus'),hero=$('dexHeroBtn'),url=buildDexUrl();if(!url){status.textContent=(localStorage.getItem('smr-language')||'en')==='id'?'PAIR BELUM DIISI':'PAIR NOT SET';link.classList.add('disabled');link.href='#';hero.href='#pasar';return}status.textContent=(localStorage.getItem('smr-language')||'en')==='id'?'PAIR TERHUBUNG':'PAIR CONNECTED';wrap.innerHTML=`<iframe class="dex-frame" src="${url}?embed=1&theme=dark" title="DEX Screener chart SEMAR" loading="lazy" allow="clipboard-write"></iframe>`;link.classList.remove('disabled');link.href=url;hero.href=url;hero.target='_blank';hero.rel='noopener noreferrer'}
function showDexSetup(){showToast((localStorage.getItem('smr-language')||'en')==='id'?'Atur CONFIG.DEX_PAIR_ADDRESS setelah Pair/Pool diverifikasi.':'Set CONFIG.DEX_PAIR_ADDRESS after the Pair/Pool is verified.')}
function calculateSwap(){const amount=Number($('payAmount').value||0);$('getAmount').value='—';$('quoteNote').textContent=amount>0?((localStorage.getItem('smr-language')||'en')==='id'?'Harga DEX belum terhubung':'DEX quote not connected'):((localStorage.getItem('smr-language')||'en')==='id'?'Masukkan jumlah':'Enter an amount')}
function switchTokens(){showToast((localStorage.getItem('smr-language')||'en')==='id'?'Pasangan swap mengikuti konfigurasi DEX.':'Swap pair follows the DEX configuration.')}function executeSwap(){if(!currentAccount){connectWallet();return}showToast((localStorage.getItem('smr-language')||'en')==='id'?'Swap belum diaktifkan di website ini. Gunakan DEX terverifikasi untuk transaksi.':'Swap is not enabled on this website. Use a verified DEX for transactions.')}
window.addEventListener('scroll',()=> $('header').classList.toggle('scrolled',scrollY>20));
if(window.ethereum){window.ethereum.on?.('accountsChanged',async a=>{currentAccount=a[0]||null;await updateWalletUI()});window.ethereum.on?.('chainChanged',async()=>{await updateWalletUI()})}
document.addEventListener('DOMContentLoaded',()=>{ $('contractAddr').textContent=CONFIG.CONTRACT_ADDRESS;setupDex();calculateSwap();if(window.ethereum&&window.ethereum.selectedAddress){currentAccount=window.ethereum.selectedAddress;updateWalletUI()} });


function initMascotCard(){
  const card=$('mascotCard');
  if(!card)return;
  const toggle=()=>{
    const flipped=card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed',String(flipped));
    card.setAttribute('aria-label',flipped?'Kartu Semar terbuka. Klik untuk kembali ke maskot.':'Kartu maskot Semar. Klik untuk membalik kartu.');
  };
  card.addEventListener('click',toggle);
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
}

document.addEventListener('DOMContentLoaded',initMascotCard);

// Bilingual interface: English is the default, Indonesian is available from the EN/ID switcher.
const LANG = {
  en: {
    market:'Market', swap:'Swap', token:'Token', tokenomics:'Tokenomics', tokenLabel:'Token', liquidityLabel:'Liquidity', notVerified:'Not verified', verifyAfterLiquidity:'Verify after liquidity is live', connectWallet:'Connect Wallet', smartContract:'SMART CONTRACT',
    openSwap:'🚀 Open Swap', dexChart:'📈 DEX Chart', walletNotConnected:'Wallet: not connected', clickToFlip:'CLICK TO FLIP ↻', clickToReturn:'CLICK TO RETURN ↻',
    maxSupplySmr:'MAX SUPPLY SMR', decimals:'DECIMALS', fee:'FEE', marketDesc:'Market data should come from a verified active DEX pair.', dexScreener:'📈 DEX SCREENER',
    chartNotConnected:'CHART NOT CONNECTED', chartSetup:'After liquidity is live, add the verified Pair/Pool Address to js/main.js.', setup:'Setup', tokenData:'🧾 TOKEN DATA',
    tokenLabel:'Token', liquidityLabel:'Liquidity', notVerified:'Not verified', verifyAfterLiquidity:'Verify after liquidity is live', tokenomics:'Tokenomics', maxSupply:'Max Supply', decimalsLabel:'Decimals', feeLabel:'Fee', verifyWarning:'⚠️ Verify liquidity, price, volume, and contract status on-chain before treating them as facts.',
    swapDesc:'This calculator is an estimate. No transaction is claimed to be executed.', youPay:'YOU PAY', estimatedReceive:'ESTIMATED RECEIVE', slippage:'Slippage', connectSwap:'⚡ CONNECT & SWAP',
    maxSupplyCaps:'MAX SUPPLY', decimalsCaps:'4 DECIMALS', smrMaximum:'SMR maximum', tokenSpecification:'Token specification', contractConfiguration:'No contract fee'
  },
  id: {
    market:'Pasar', swap:'Tukar', token:'Token', tokenomics:'Tokenomics', tokenLabel:'Token', liquidityLabel:'Likuiditas', notVerified:'Belum diverifikasi', verifyAfterLiquidity:'Verifikasi setelah likuiditas aktif', connectWallet:'Hubungkan Wallet', smartContract:'SMART CONTRACT',
    openSwap:'🚀 Buka Swap', dexChart:'📈 Grafik DEX', walletNotConnected:'Wallet: belum terhubung', clickToFlip:'KLIK UNTUK MEMBALIK ↻', clickToReturn:'KLIK UNTUK KEMBALI ↻',
    maxSupplySmr:'MAX SUPPLY SMR', decimals:'DESIMAL', fee:'FEE', marketDesc:'Data pasar harus berasal dari pasangan DEX aktif yang telah terverifikasi.', dexScreener:'📈 DEX SCREENER',
    chartNotConnected:'GRAFIK BELUM TERHUBUNG', chartSetup:'Setelah likuiditas aktif, tambahkan alamat Pair/Pool yang terverifikasi ke js/main.js.', setup:'Atur', tokenData:'🧾 DATA TOKEN',
    tokenLabel:'Token', liquidityLabel:'Likuiditas', notVerified:'Belum diverifikasi', verifyAfterLiquidity:'Verifikasi setelah likuiditas aktif', tokenomics:'Tokenomics', maxSupply:'Max Supply', decimalsLabel:'Desimal', feeLabel:'Fee', verifyWarning:'⚠️ Verifikasi likuiditas, harga, volume, dan status kontrak secara on-chain sebelum menganggapnya sebagai fakta.',
    swapDesc:'Kalkulator ini hanya perkiraan. Tidak ada transaksi yang diklaim telah dijalankan.', youPay:'ANDA BAYAR', estimatedReceive:'PERKIRAAN DITERIMA', slippage:'Slippage', connectSwap:'⚡ HUBUNGKAN & SWAP',
    maxSupplyCaps:'MAX SUPPLY', decimalsCaps:'4 DESIMAL', smrMaximum:'maksimum SMR', tokenSpecification:'Spesifikasi token', contractConfiguration:'Tanpa biaya kontrak'
  }
};
function applyLanguage(lang){
  const dict=LANG[lang]||LANG.en;
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(dict[key]!==undefined)el.textContent=dict[key]});
  document.querySelectorAll('.lang-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));
  localStorage.setItem('smr-language',lang);
  if($('btnWalletText'))$('btnWalletText').textContent=currentAccount?shortAddress(currentAccount):dict.connectWallet;
  if($('walletNetwork')&&!currentAccount)$('walletNetwork').textContent=dict.walletNotConnected;
  if($('quoteNote')&&$('payAmount'))$('quoteNote').textContent=Number($('payAmount').value||0)>0?(lang==='id'?'Harga DEX belum terhubung':'DEX quote not connected'):(lang==='id'?'Masukkan jumlah':'Enter an amount');
}
function initLanguage(){
  document.querySelectorAll('.lang-btn').forEach(btn=>btn.addEventListener('click',()=>applyLanguage(btn.dataset.lang)));
  applyLanguage(localStorage.getItem('smr-language')||'en');
}
document.addEventListener('DOMContentLoaded',initLanguage);
