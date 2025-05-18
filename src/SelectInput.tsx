import type { ChangeEvent, PropsWithoutRef } from "react";

export function SelectInput({
  label = "",
  onChange,
  options,
  name,
  value = "",
  error,
}: Props) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <select name={name} onChange={onChange} value={value || ""}>
        {options
          .concat({ key: "none", value: "", display: "Choose Option" })
          .map((option: Option) => (
            <option key={option.key} value={option.value}>
              {option.display}
            </option>
          ))}
      </select>
      {error && <p>{error}</p>}
    </>
  );
}

type Props = PropsWithoutRef<{
  error?: string;
  label?: string;
  name: string;
  options: Option[];
  value?: string | null;
  onChange: (ev: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}>;

type Option = {
  key: string;
  value: string;
  display: string;
};
