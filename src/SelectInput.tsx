import type { ChangeEvent, PropsWithoutRef } from "react";

// by abstracting the SelectInput I have the flexibility to style the component in any way I want
// so should this would require any type of styling I'd just have to keep the Props/API
// of the component intact and would restyle update the styling fairly quickly

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
