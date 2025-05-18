import { useEffect, useState } from "react";

import { CurrencyForm, type ConvertCurrency } from "./CurrencyForm";

import "./App.css";
import { convertCurrency } from "./api";

// the app should figure out what should be done after the CurrencyForm has been submitted

export function App() {
  const [convert, setConvert] = useState<ConvertCurrency>({
    amount: null,
    from: null,
    to: null,
  });

  const [result, setResult] = useState<string>("");

  useEffect(
    function () {
      if (convert.amount && convert.from && convert.to) {
        convertCurrency(convert).then((apiResult: number) => {
          setResult(apiResult.toFixed(convert.to?.precision));
        });
      }
    },
    [convert.amount, convert.from?.short_code, convert.to?.short_code]
  );
  const exchangeCurrency = (convert: ConvertCurrency) => {
    setConvert(convert);
  };

  return (
    <>
      <CurrencyForm onSubmit={exchangeCurrency} />
      {result ? <div>Result: {result}</div> : null}
    </>
  );
}
