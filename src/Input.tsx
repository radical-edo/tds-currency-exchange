import type { ChangeEvent, PropsWithoutRef } from "react";

// by abstracting the Input I have the flexibility to style the component in any way I want
// so should this would require any type of styling I'd just have to keep the Props/API
// of the component intact and would restyle update the styling fairly quickly

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
