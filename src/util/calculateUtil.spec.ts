import * as dotenv from 'dotenv';
import { Trade } from '../domain/domain';
import { CalculateUtil as calculateUtil } from './calculateUtil';

dotenv.config();

describe('CalculateUtil', () => {
  beforeEach(() => {});

  test('should be created', () => {
    expect(calculateUtil).toBeTruthy();
  });

  test('#sum 正常に少数の加算ができているか', async () => {
    const target = calculateUtil.sum(['0.001', 0.0002, '0.00003', 0.000004]);
    expect(target).toEqual(0.001234);
  });

  test('#aveBuyPrice 正常にTrade[]から平均購入価格が算出できているか_1', async () => {
    const trades: Trade[] = [
      {
        symbol: 'test1',
        price: '100',
        qty: '1',
        commission: '',
        commissionAsset: '',
        time: 0,
        isBuy: true,
      },
      {
        symbol: 'test1',
        price: '200',
        qty: '1',
        commission: '',
        commissionAsset: '',
        time: 0,
        isBuy: true,
      },
    ];
    const target = calculateUtil.aveBuyPrice(trades);
    expect(target).toEqual(150);
  });

  test('#aveBuyPrice 正常にTrade[]から平均購入価格が算出できているか_2', async () => {
    const trades: Trade[] = [
      {
        symbol: 'test1',
        price: '0.005',
        qty: '0.01',
        commission: '',
        commissionAsset: '',
        time: 0,
        isBuy: true,
      },
      {
        symbol: 'test1',
        price: '0.01',
        qty: '0.01',
        commission: '',
        commissionAsset: '',
        time: 0,
        isBuy: true,
      },
    ];
    const target = calculateUtil.aveBuyPrice(trades);
    expect(target).toEqual(0.0075);
  });
});