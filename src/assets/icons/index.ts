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
} as const;

export type IconName = keyof typeof icons;