export interface Balance {
  free: string; // 発注されていない数量
  locked: string; // 発注されている数量
}

export interface AveBuyPrice {
  aveBuyPrice: number; // 平均購入価額
}

export interface ProfitRatio {
  nowSymbolPrice: number; // symbolの現在取引価格
  profitRatio: number; // 利益率
}

export interface Trade {
  symbol: string; // 通貨ペア
  price: string; // 取引価格
  qty: string; // 取引数量
  commission: string; // 手数料
  commissionAsset: string; // 手数料通貨
  time: number; // 取引日時
  isBuy: boolean; // 買いor売り
}
