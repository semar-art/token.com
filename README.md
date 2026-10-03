# SEMAR KOIN RAKYAT — $SMR

Website statis untuk GitHub Pages.

## Tampilan
- Dark mode
- Dominasi kuning / hitam
- Gaya komik tegas
- Responsive untuk desktop dan mobile
- Roadmap dihapus

## Wallet
Tombol **Connect Wallet** menggunakan standar injected EIP-1193 (`window.ethereum`), sehingga MetaMask dan wallet EVM yang menyediakan provider injected dapat digunakan.

Website membaca alamat akun dan saldo native wallet. Saldo SMR belum dibuat-buat; integrasi `balanceOf` ERC-20 dapat ditambahkan setelah jaringan/kontrak final dikonfirmasi.

## DEX Screener
Setelah liquidity dibuat, edit `js/main.js`:

```js
DEX_CHAIN: 'polygon',
DEX_PAIR_ADDRESS: 'ALAMAT_PAIR_POOL'
```

Untuk Uniswap V3 gunakan **Pool Address**, bukan alamat token.

## Catatan
Tampilan swap saat ini adalah UI/kalkulator dan tidak mengirim transaksi swap. Untuk transaksi nyata diperlukan router DEX yang benar, chain ID, alamat router, token, dan ABI yang sesuai.
