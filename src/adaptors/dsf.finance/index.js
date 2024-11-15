const sdk = require('@defillama/sdk');
const utils = require('../utils');

const dsfPoolStables = '0x22586ea4fdaa9ef012581109b336f0124530ae69';

const abi = {
  totalHoldings: "uint256:totalHoldings"
};

const collectPools = async () => {
  
  const tvl = await getTVL(dsfPoolStables);
  const apyData = await getAPYFromAPI();

  return [
    {
      pool: `${dsfPoolStables}-ethereum`,
      chain: utils.formatChain('ethereum'),
      project: 'dsf.finance',
      symbol: 'USDT-USDC-DAI',
      tvlUsd: tvl / 1e18,
      apy: apyData.apy * 0.8,
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

async function getTVL(contractAddress) {
  const tvlResponse = await sdk.api.abi.call({
    target: contractAddress,
    abi: abi.totalHoldings,
    chain: 'ethereum',
  });
  const totalHoldings = tvlResponse.output;
  return totalHoldings;
}

async function getAPYFromAPI() {
  const response = await utils.getData('https://yields.llama.fi/chart/8a20c472-142c-4442-b724-40f2183c073e');
  const latestData = response[response.length - 1]; // берем последнее значение
  return { apy: latestData.apy };
}

module.exports = {
  timetravel: false,
  apy: collectPools,
  url: 'https://dsf.finance/',
};
