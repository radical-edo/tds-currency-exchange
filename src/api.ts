import { type ConvertCurrency } from "./CurrencyForm";

const authorization = `Bearer ${import.meta.env.VITE_API_KEY}`;
// above API key should not be part of the frontend code
// normally I'd recommend to store this in the backend and provide a simple reverse proxy to hide the API key

export async function convertCurrency(
  convert: ConvertCurrency
): Promise<number> {
  try {
    const res = await fetch(
      `https://api.currencybeacon.com/v1/convert?from=${convert.from!.short_code}&to=${convert.to!.short_code}&amount=${convert.amount}`,
      {
        headers: {
          authorization,
        },
      }
    );
    if (res.ok) {
      const body = await res.json();
      return body.response.value;
    } else {
      throw new Error("Failed to convert currency");
    }
  } catch (error) {
    console.error("Error converting currency:");
    console.log(error);
    throw error;
  }
}

export async function supportedCurrencies(): Promise<Currency[] | null> {
  try {
    const res = await fetch("https://api.currencybeacon.com/v1/currencies", {
      headers: {
        authorization,
      },
    });
    if (res.ok) {
      const data: CurrencyResponse = await res.json();
      return data.response.map((currency) => ({
        precision: currency.precision,
        id: currency.id,
        decimal_mark: currency.decimal_mark,
        thousands_separator: currency.thousands_separator,
        short_code: currency.short_code,
        name: currency.name,
      }));
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching supported currencies:");
    console.log(error);
    return null;
  }
}

type CurrencyResponse = {
  meta: { code: number; disclaimer: string };
  response: FullCurrencyInfo[];
};

export type Currency = {
  id: string;
  name: string;
  short_code: string;
  decimal_mark: string;
  thousands_separator: string;
  precision: number;
};

type FullCurrencyInfo = Currency & {
  id: number;
  code: string;
  precision: number;
  subunit: number;
  symbol: string;
  symbol_first: boolean;
};
