const CONFIG = {
  CONTRACT_ADDRESS: '0x90F9F3794Bd2Ee4C05cEB720f21D98D626393502',
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
async function copyContract(){try{await navigator.clipboard.writeText(CONFIG.CONTRACT_ADDRESS);showToast('Alamat kontrak disalin!')}catch(e){showToast('Gagal menyalin alamat.')}}
async function getChain(){if(!window.ethereum)return null;return await window.ethereum.request({method:'eth_chainId'})}
function networkName(id){const m={'0x1':'Ethereum','0x89':'Polygon','0x38':'BNB Chain','0xa86a':'Avalanche','0xa4b1':'Arbitrum One','0xa':'Optimism','0x2105':'Base'};return m[id]||id||'Unknown'}
async function connectWallet(){
  if(!window.ethereum){showToast('MetaMask / wallet EVM belum terdeteksi. Instal MetaMask lalu coba lagi.');return}
  try{
    $('btnWalletText').textContent='Menghubungkan...';
    const accounts=await window.ethereum.request({method:'eth_requestAccounts'});
    currentAccount=accounts[0]||null;
    await updateWalletUI();
    showToast(currentAccount?'Wallet terhubung!':'Wallet belum terhubung.');
  }catch(err){$('btnWalletText').textContent='Connect Wallet';showToast(err?.message||'Koneksi wallet dibatalkan.')}
}
async function updateWalletUI(){
  const id=await getChain();
  $('btnWalletText').textContent=currentAccount?shortAddress(currentAccount):'Connect Wallet';
  $('walletNetwork').textContent=currentAccount?`Wallet: ${networkName(id)}`:'Wallet: belum terhubung';
  if(currentAccount)await refreshWalletBalance();else{$('userBalanceBNB').textContent='—';$('userBalanceSemar').textContent='—'}
}
async function refreshWalletBalance(){
  if(!currentAccount||!window.ethereum)return;
  try{const hex=await window.ethereum.request({method:'eth_getBalance',params:[currentAccount,'latest']});$('userBalanceBNB').textContent=(Number(BigInt(hex))/1e18).toFixed(4)}catch(e){$('userBalanceBNB').textContent='—'}
  $('userBalanceSemar').textContent='—';
}
function buildDexUrl(){return CONFIG.DEX_PAIR_ADDRESS?`${CONFIG.DEX_EMBED_BASE}/${CONFIG.DEX_CHAIN}/${CONFIG.DEX_PAIR_ADDRESS}`:''}
function setupDex(){const wrap=$('dexFrameWrap'),link=$('dexLink'),status=$('dexStatus'),hero=$('dexHeroBtn'),url=buildDexUrl();if(!url){status.textContent='PAIR BELUM DIISI';link.classList.add('disabled');link.href='#';hero.href='#pasar';return}status.textContent='PAIR TERHUBUNG';wrap.innerHTML=`<iframe class="dex-frame" src="${url}?embed=1&theme=dark" title="DEX Screener chart SEMAR" loading="lazy" allow="clipboard-write"></iframe>`;link.classList.remove('disabled');link.href=url;hero.href=url;hero.target='_blank';hero.rel='noopener noreferrer'}
function showDexSetup(){showToast('Isi CONFIG.DEX_PAIR_ADDRESS setelah Pair/Pool terverifikasi.')}
function calculateSwap(){const amount=Number($('payAmount').value||0);$('getAmount').value='—';$('quoteNote').textContent=amount>0?'Quote DEX belum terhubung':'Masukkan jumlah'}
function switchTokens(){showToast('Pasangan swap mengikuti konfigurasi DEX.')}function executeSwap(){if(!currentAccount){connectWallet();return}showToast('Swap belum diaktifkan di website. Gunakan DEX terverifikasi untuk transaksi.')}
window.addEventListener('scroll',()=> $('header').classList.toggle('scrolled',scrollY>20));
if(window.ethereum){window.ethereum.on?.('accountsChanged',async a=>{currentAccount=a[0]||null;await updateWalletUI()});window.ethereum.on?.('chainChanged',async()=>{await updateWalletUI()})}
document.addEventListener('DOMContentLoaded',()=>{ $('contractAddr').textContent=CONFIG.CONTRACT_ADDRESS;setupDex();calculateSwap();if(window.ethereum&&window.ethereum.selectedAddress){currentAccount=window.ethereum.selectedAddress;updateWalletUI()} });
