import type { ChangeEvent, PropsWithoutRef } from "react";

export function Input({
  onChange,
  value,
  name,
  label,
  error,
}: PropsWithoutRef<Props>) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input type="text" value={value} name={name} onChange={onChange} />
      {error && <p>{error}</p>}
    </>
  );
}

type Props = {
  error?: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  label: string;
};
