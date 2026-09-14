import { default as BagIcon } from "./bag.svg";
import { default as BankIcon } from "./bank.svg";
import { default as CarIcon } from "./car.svg";
import { default as CointsIcon } from "./coint.svg";
import { default as CreditIcon } from "./credit.svg";
import { default as FlightIcon } from "./flight.svg";
import { default as HatIcon } from "./hat.svg";
import { default as HeartIcon } from "./heart.svg";
import { default as HomeIcon } from "./home.svg";
import { default as PigIcon } from "./pig.svg";
import { default as ShopIcon } from "./shop.svg";
import { default as WalletIcon } from "./wallet.svg";
import { default as Health } from "./health.svg";
import { default as Food } from "./food.svg";
import { default as Coffee } from "./coffe.svg";
import { default as Other } from "./other.svg";
import { default as PC } from "./pc.svg";
import { default as Gift } from "./gift.svg";
import { default as Refund } from "./refund.svg";
import { default as Cash } from "./cash.svg";
import { default as Sale } from "./sale.svg";
import { default as Trending } from "./trending.svg";

export const icons = {
  bag: BagIcon,
  bank: BankIcon,
  car: CarIcon,
  coints: CointsIcon,
  credit: CreditIcon,
  flight: FlightIcon,
  hat: HatIcon,
  heart: HeartIcon,
  home: HomeIcon,
  pig: PigIcon,
  shop: ShopIcon,
  wallet: WalletIcon,
  health: Health,
  food: Food,
  coffee: Coffee,
  other: Other,
  pc: PC,
  gift: Gift,
  refund: Refund,
  cash: Cash,
  sale: Sale,
  trending: Trending,
} as const;

export type IconName = keyof typeof icons;
