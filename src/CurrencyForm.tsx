import {
  useState,
  useEffect,
  type ChangeEvent,
  type PropsWithoutRef,
  type FormEvent,
} from "react";

import { type Currency, supportedCurrencies } from "./api";
import { SelectInput } from "./SelectInput";
import { Input } from "./Input";

const ErrorMsgs: Record<string | "from" | "to" | "amount", string> = {
  from: "This field is required",
  to: "This field is required",
  amount: "This field is required and should be a positive number",
};

// fetching the data as part of the form instead of some higher component
// helps to make the component moveable
// otherwise the logic for fetching data would have to be re-implemented in the higher component
// each time this form would be reused

export function CurrencyForm(
  props: PropsWithoutRef<{ onSubmit: (output: ConvertCurrency) => void }>
) {
  const [errorMsgs, setErrorMsgs] = useState<typeof ErrorMsgs>({});
  const [currencies, setCurrencies] = useState<Currency[] | null>([]);
  const [amount, setAmount] = useState<string>("");
  const [selectedCurrencies, setSelectedCurrencies] =
    useState<SelectedCurrencies>({
      from: null,
      to: null,
    });

  const updateAmount = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;

    setAmount(value);
  };

  const updateCurrency = (ev: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = ev.target;
    setSelectedCurrencies((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const errors = Object.entries(selectedCurrencies)
      .map(([name, value]) => {
        if (value == null || value === "") {
          return { name, error: ErrorMsgs[name] };
        }
        return null;
      })
      .filter((error) => error != null);
    if (errors.length === 0 && currencies != null) {
      const fromCurrency = currencies.find(
        (currency) => currency.short_code === selectedCurrencies.from
      ) as Currency;
      const parsedAmount = Number(
        amount
          .replace(fromCurrency.thousands_separator, "")
          .replace(fromCurrency.decimal_mark, ".")
          .trim()
      );
      if (Number.isNaN(parsedAmount) === false && parsedAmount > 0) {
        setErrorMsgs({});
        props.onSubmit({
          amount: Number(Number(parsedAmount).toFixed(fromCurrency.precision)),
          from: fromCurrency,
          to: currencies.find(
            (c) => c.short_code === selectedCurrencies.to
          ) as Currency,
        });
      } else {
        setErrorMsgs({
          amount: ErrorMsgs.amount,
        });
      }
    } else {
      setErrorMsgs(
        errors.reduce((acc, { name, error }) => ({ [name]: error, ...acc }), {})
      );
    }
  };

  useEffect(function () {
    supportedCurrencies().then((currencies) => {
      setCurrencies(currencies);
    });
  }, []);

  if (currencies === null) {
    return <p>Api Disabled</p>;
  }

  const selectOptions = currencies.map((currency) => ({
    key: String(currency.id),
    display: `${currency.name} (${currency.short_code})`,
    value: currency.short_code,
  }));

  return (
    <form method="post" onSubmit={submit}>
      <div>
        <Input
          label="Amount "
          name="amount"
          onChange={updateAmount}
          value={amount}
          error={errorMsgs.amount}
        />
      </div>
      <div>
        <SelectInput
          label="From "
          name="from"
          options={selectOptions}
          onChange={updateCurrency}
          value={selectedCurrencies.from}
          error={errorMsgs.from}
        />
      </div>
      <div>
        <SelectInput
          label="To "
          name="to"
          options={selectOptions}
          onChange={updateCurrency}
          value={selectedCurrencies.to}
          error={errorMsgs.to}
        />
      </div>
      <button>Convert</button>
    </form>
  );
}

export type ConvertCurrency = {
  amount: number | null;
  from: Currency | null;
  to: Currency | null;
};

type SelectedCurrencies = {
  from: string | null;
  to: string | null;
};
