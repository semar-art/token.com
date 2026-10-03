const CONFIG = {
  CONTRACT_ADDRESS: '0x90F9F3794Bd2Ee4C05cEB720f21D98D626393502',
  DEX_CHAIN: 'bsc',
  DEX_PAIR_ADDRESS: '',
  DEX_EMBED_BASE: 'https://dexscreener.com'
};
let currentAccount=null, toastTimer;
const $=id=>document.getElementById(id);
function shortAddress(a){return a?`${a.slice(0,6)}...${a.slice(-4)}`:'—'}
function showToast(m){const e=$('toast');e.textContent=m;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),3200)}
async function copyContract(){try{await navigator.clipboard.writeText(CONFIG.CONTRACT_ADDRESS);showToast('Contract address copied!')}catch(e){showToast('Could not copy contract address.')}}
async function getChain(){if(!window.ethereum)return null;return await window.ethereum.request({method:'eth_chainId'})}
function networkName(id){const m={'0x1':'Ethereum','0x89':'Polygon','0x38':'BNB Chain','0xa86a':'Avalanche','0xa4b1':'Arbitrum One','0xa':'Optimism','0x2105':'Base'};return m[id]||id||'Unknown'}
async function connectWallet(){
  if(!window.ethereum){showToast('No EVM wallet detected. Open Uniswap and connect your wallet there.');return}
  try{
    $('btnWalletText').textContent='Connecting...';
    const accounts=await window.ethereum.request({method:'eth_requestAccounts'});
    currentAccount=accounts[0]||null;
    await updateWalletUI();
    showToast(currentAccount?'Wallet connected!':'Wallet not connected.');
  }catch(err){$('btnWalletText').textContent='Connect Wallet';showToast(err?.message||'Wallet connection cancelled.')}
}
async function updateWalletUI(){
  const id=await getChain();
  $('btnWalletText').textContent=currentAccount?shortAddress(currentAccount):'Connect Wallet';
  $('walletNetwork').textContent=currentAccount?`Wallet: ${networkName(id)}`:'Wallet: not connected';
}
function buildDexUrl(){return CONFIG.DEX_PAIR_ADDRESS?`${CONFIG.DEX_EMBED_BASE}/${CONFIG.DEX_CHAIN}/${CONFIG.DEX_PAIR_ADDRESS}`:''}
function setupDex(){const wrap=$('dexFrameWrap'),link=$('dexLink'),status=$('dexStatus'),hero=$('dexHeroBtn'),url=buildDexUrl();if(!url){status.textContent='PAIR BELUM DIISI';link.classList.add('disabled');link.href='#';hero.href='#pasar';return}status.textContent='PAIR TERHUBUNG';wrap.innerHTML=`<iframe class="dex-frame" src="${url}?embed=1&theme=dark" title="DEX Screener chart SEMAR" loading="lazy" allow="clipboard-write"></iframe>`;link.classList.remove('disabled');link.href=url;hero.href=url;hero.target='_blank';hero.rel='noopener noreferrer'}
function showDexSetup(){showToast('Set CONFIG.DEX_PAIR_ADDRESS after the Pair/Pool is verified.')}
window.addEventListener('scroll',()=> $('header').classList.toggle('scrolled',scrollY>20));
if(window.ethereum){window.ethereum.on?.('accountsChanged',async a=>{currentAccount=a[0]||null;await updateWalletUI()});window.ethereum.on?.('chainChanged',async()=>{await updateWalletUI()})}
document.addEventListener('DOMContentLoaded',()=>{ $('contractAddr').textContent=CONFIG.CONTRACT_ADDRESS;setupDex();if(window.ethereum&&window.ethereum.selectedAddress){currentAccount=window.ethereum.selectedAddress;updateWalletUI()} });


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


function initSwapPanel(){
  const amount=$('swapAmount'), receive=$('receiveAmount'), payToken=$('payToken'), paySymbol=$('paySymbol'), state=$('swapWalletState');
  if(!amount)return;
  const sync=()=>{receive.value=amount.value?amount.value:'—'; state.textContent=currentAccount?shortAddress(currentAccount):'Wallet not connected';};
  amount.addEventListener('input',sync);
  $('swapSwitch')?.addEventListener('click',()=>{
    const old=payToken.textContent; payToken.textContent=$('receiveToken').textContent; $('receiveToken').textContent=old;
    paySymbol.textContent=payToken.textContent; sync();
  });
  $('copySwapContract')?.addEventListener('click',copyContract);
  $('swapSettings')?.addEventListener('click',()=>showToast('Atur network, route, dan slippage di Uniswap.'));
  $('uniswapSwapBtn')?.addEventListener('click',()=>{
    const url='https://app.uniswap.org/swap?outputCurrency='+encodeURIComponent(CONFIG.CONTRACT_ADDRESS);
    window.open(url,'_blank','noopener,noreferrer');
  });
  sync();
}
document.addEventListener('DOMContentLoaded',initSwapPanel);
