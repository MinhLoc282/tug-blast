/* eslint-disable import/prefer-default-export */
import { TUGPAIR_BTC_XAU, TUGPAIR_ETH_BTC, TUGPAIR_ETH_MSFT, TUGPAIR_BTC_XAU_FULL, TUGPAIR_ETH_BTC_FULL } from '../constant';

export const FAKE_DATA = {
  tugPairs: [
    {
      id: TUGPAIR_ETH_BTC,
      type: 'Yield',
      token0Index: 2,
      token1Index: 1,
      startTime: 1709860000,
      tugDuration: 259200,
    },
    {
      id: TUGPAIR_ETH_BTC_FULL,
      type: 'Full',
      token0Index: 2,
      token1Index: 1,
      startTime: 1709860000,
      tugDuration: 259200,
    },
    {
      id: TUGPAIR_ETH_MSFT,
      token0Index: 2,
      token1Index: 3,
      startTime: 1707900000,
      tugDuration: 3600,
    },
    {
      id: TUGPAIR_BTC_XAU,
      type: 'Yield',
      token0Index: 1,
      token1Index: 4,
      startTime: 1709860000,
      tugDuration: 259200,
    },
    {
      id: TUGPAIR_BTC_XAU_FULL,
      type: 'Full',
      token0Index: 1,
      token1Index: 4,
      startTime: 1709860000,
      tugDuration: 259200,
    },
  ],
  pairUsers: [
    {
      id: '0x15f976917330fe5d51d87971fce599d4ad586846.0x1897e8dd61f791f587515ae343d9188cf1d8dd8d',
      totalToken0Deposits: '433',
      totalToken1Deposits: '0',
      uncollectedEpochs: [
        87,
      ],
    },
  ],
};
