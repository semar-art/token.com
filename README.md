# SEMAR KOIN RAKYAT — $SMR

Static website for GitHub Pages.

## Token details configured on the website
- Network: BNB Chain (BSC, chain ID 56)
- Contract address: `0x072bea052e66529de702d2bc3ae0f1446891ffff`
- Total supply: 1,000,000,000 SMR
- Decimals: 18
- Transaction fee shown: 1%

The supply, decimals, and fee above are the values supplied for the website. The website does not independently prove that the deployed contract implements these parameters. Verify the token contract on BscScan before relying on them.

## Live market data
The market panel requests the real pair data from the public DEX Screener token-pairs API for BNB Chain and selects the returned pair with the highest reported USD liquidity. Price, market cap/FDV, 24-hour volume, and chart are not fabricated. If no indexed BNB Chain pair is returned or the API is unavailable, values remain unavailable and the page links to Four.meme.

## Four.meme
Token page: https://four.meme/token/0x072bea052e66529de702d2bc3ae0f1446891ffff

## Wallet
The wallet button uses an injected EVM wallet provider such as MetaMask. BNB Chain is identified by chain ID `0x38`. The site does not execute swaps.
