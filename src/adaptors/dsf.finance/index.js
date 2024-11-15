const ADDRESSES = require('../helper/coreAssets.json');
const abi = require('./abi.json');
const utils = require('../utils');

const dsfPoolStables = '0x22586ea4fdaa9ef012581109b336f0124530ae69';

const collectPools = async () => {
  const tvl = await api.call({
    abi: abi.totalHoldings, // Убедитесь, что функция `totalHoldings` в ABI возвращает общее значение TVL
    target: dsfPoolStables,
  });
  
  const data = await utils.getData('https://api2.dsf.finance/api/total-apy-tvl');
  const info = data['data']['info'];

  return [
    {
      pool: `${dsfPoolStables}-ethereum`,
      chain: utils.formatChain('ethereum'),
      project: 'dsf.finance',
      symbol: 'USDT-USDC-DAI',
      tvlUsd: tvl / 1e18,
      apy: info['apy'],
      rewardTokens: null,
      underlyingTokens: [
        '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
        '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        '0x6B175474e89094C44Da98b954EedeAC495271d0F'  // DAI
      ],
      url: 'https://app.dsf.finance/',
    }
  ];
};

module.exports = {
  timetravel: false,
  apy: collectPools,
  url: 'https://dsf.finance/',
};
