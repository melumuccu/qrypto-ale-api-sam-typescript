import { Account, MyTrade, TradingType, TradingType_LT } from 'binance-api-node';
import { AveBuyPrice, BinanceUtil } from '../../../src/util/binanceUtil';

const util = new BinanceUtil();

describe('binanceUtil', () => {
  it('util.getHasCoinList(true)', async () => {
    const spyBinanceAccountInfo = jest
      .spyOn(util.binance, 'accountInfo')
      .mockImplementation(() => new Promise(resolve => resolve(binanceAccountInfo)));

    const spyBinancePrices = jest
      .spyOn(util.binance, 'prices')
      .mockImplementationOnce(() => new Promise(resolve => resolve({ BTCUSDT: '50000' })))
      .mockImplementationOnce(() => new Promise(resolve => resolve({ SANDUSDT: '20' })))
      .mockImplementationOnce(() => new Promise(resolve => resolve({ ADAUSDT: '1' })))
      .mockImplementationOnce(() => new Promise((resolve, reject) => reject(undefined))); // symbol => USDTUSDT

    const result = await util.getHasCoinList(true);
    const expectedResult = binanceAccountInfo.balances.slice(0, 2); // BTC, SANDがpass

    expect(spyBinanceAccountInfo).toHaveBeenCalledTimes(1);
    expect(spyBinancePrices).toHaveBeenCalledTimes(4);
    expect(result).toEqual(expectedResult);
  });
  it('util.calAvePriceHaveNow(AssetBalance[])', async () => {
    const spyBinanceMyTrades = jest
      .spyOn(util.binance, 'myTrades')
      .mockImplementationOnce(() => new Promise(resolve => resolve(binanceMyTradesBTC)))
      .mockImplementationOnce(() => new Promise(resolve => resolve(binanceMyTradesSAND)));

    const result = await util.calAvePriceHaveNow(binanceAccountInfo.balances.slice(0, 2)); // 'util.getHasCoinList(true)'のテストの期待値が渡される想定
    const expectedResult: AveBuyPrice[] = [
      { balance: binanceAccountInfo.balances[0], aveBuyPrice: 50000 }, // BTC
      { balance: binanceAccountInfo.balances[1], aveBuyPrice: 10 }, // SAND
    ];

    expect(spyBinanceMyTrades).toHaveBeenCalledTimes(2);
    expect(result).toEqual(expectedResult);
  });
});

//=========================================================
// テストデータ
//=========================================================

/**
 * 戻り値: BinanceUtil.binance.accountInfo()
 */
const binanceAccountInfo: Account = {
  accountType: 'SPOT' as TradingType,
  balances: [
    {
      asset: 'BTC', // [通常の通貨, amount: あり, 例1] => amount: OK, baseFiat換算後: OK
      free: '0.01',
      locked: '0.00000000',
    },
    {
      asset: 'SAND', // [通常の通貨, amount: あり, 例2] => amount: OK, baseFiat換算後: OK
      free: '50.00000000',
      locked: '150.00000000',
    },
    {
      asset: 'ADA', // [通常の通貨, amount: あり, 例3] => amount: OK, baseFiat換算後: NG
      free: '0.10000000',
      locked: '0.00000000',
    },
    {
      asset: 'USDT', // [基軸通貨, amount: あり] => amount: OK, baseFiat換算後: NG
      free: '499.50000000',
      locked: '0.50000000',
    },
    {
      asset: 'XRP', // [通常の通貨, amount: なし] => amount: NG
      free: '0.00000000',
      locked: '0.00000000',
    },
  ],
  buyerCommission: 0,
  canDeposit: true,
  canTrade: true,
  canWithdraw: true,
  makerCommission: 10,
  permissions: ['SPOT'] as TradingType_LT[],
  sellerCommission: 0,
  takerCommission: 10,
  updateTime: 1648465688412,
};

/**
 * 戻り値: BinanceUtil.binance.myTrades({ symbol: 'BTCUSDT' })
 */
const binanceMyTradesBTC: MyTrade[] = [
  // expect: [sumQty: 0.01, aveBuyPrice: 50000]
  {
    symbol: 'BTCUSDT',
    commissionAsset: 'BTC',
    time: 1634101247987,
    isBuyer: true,
    price: '45000.00000000',
    qty: '0.00500000',
    id: 10000001,
    orderId: 10000001,
    orderListId: -1,
    quoteQty: '1.00000000',
    commission: '0.00010000',
    isMaker: true,
    isBestMatch: true,
  },
  {
    symbol: 'BTCUSDT',
    commissionAsset: 'BTC',
    time: 1634101247987,
    isBuyer: true,
    price: '55000.00000000',
    qty: '0.00500000',
    id: 10000001,
    orderId: 10000001,
    orderListId: -1,
    quoteQty: '1.00000000',
    commission: '0.00010000',
    isMaker: true,
    isBestMatch: true,
  },
];

/**
 * 戻り値: BinanceUtil.binance.myTrades({ symbol: 'SANDUSDT' })
 */
const binanceMyTradesSAND: MyTrade[] = [
  // expect: [sumQty: 200, aveBuyPrice: 10]
  {
    symbol: 'SANDUSDT',
    commissionAsset: 'SAND',
    time: 1634101247987,
    isBuyer: true,
    price: '12.00000000',
    qty: '100.00000000',
    id: 10000001,
    orderId: 10000001,
    orderListId: -1,
    quoteQty: '1.00000000',
    commission: '0.00010000',
    isMaker: true,
    isBestMatch: true,
  },
  {
    symbol: 'SANDUSDT',
    commissionAsset: 'SAND',
    time: 1634101247987,
    isBuyer: true,
    price: '9.50000000',
    qty: '50.00000000',
    id: 10000001,
    orderId: 10000001,
    orderListId: -1,
    quoteQty: '1.00000000',
    commission: '0.00010000',
    isMaker: true,
    isBestMatch: true,
  },
  {
    symbol: 'SANDUSDT',
    commissionAsset: 'SAND',
    time: 1634101247987,
    isBuyer: true,
    price: '6.50000000',
    qty: '50.00000000',
    id: 10000001,
    orderId: 10000001,
    orderListId: -1,
    quoteQty: '1.00000000',
    commission: '0.00010000',
    isMaker: true,
    isBestMatch: true,
  },
  {
    symbol: 'SANDUSDT',
    commissionAsset: 'SAND',
    time: 1634101247987,
    isBuyer: false, // 売りなので除外
    price: '9999.00000000',
    qty: '10000.00000000',
    id: 10000001,
    orderId: 10000001,
    orderListId: -1,
    quoteQty: '1.00000000',
    commission: '0.00010000',
    isMaker: true,
    isBestMatch: true,
  },
];
