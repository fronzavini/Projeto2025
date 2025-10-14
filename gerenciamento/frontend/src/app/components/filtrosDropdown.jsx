import { Dropdown } from "primereact/dropdown";
import styles from "../styles/filtros.module.css";

export function FiltroDropdown({
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção",
  label,
}) {
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
          appendTo="self" // evita scroll duplo e funciona com SSR
        />
      </div>
    </div>
  );
}