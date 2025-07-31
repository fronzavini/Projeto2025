import { Dropdown } from "primereact/dropdown";
import styles from "../styles/filtros.module.css";

export interface Opcao {
  label: string;
  value: string;
}

interface FiltroDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Opcao[];
  placeholder?: string;
  label?: string;
}

export function FiltroDropdown({
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção",
  label,
}: FiltroDropdownProps) {
  return (
    <div className={styles.filtro}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.caixaInput}>
        <Dropdown
          value={value}
          options={options}
          onChange={(e) => onChange(e.value ?? "")}
          optionLabel="label"
          placeholder={placeholder}
          showClear={!!value}
          className={`${styles.input} ${styles.dropdownPersonalizado}`}
          appendTo={document.body} // <<< aqui está a mágica para evitar scroll duplo
        />
      </div>
    </div>
  );
}
