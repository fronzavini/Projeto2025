import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";

import styles from "../styles/filtros.module.css";

interface FiltrosInput {
  label?: string;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Filtros({ label, value, onChange, placeholder }: FiltrosInput) {
  return (
    <div className={styles.filtro}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.caixaInput}>
        <InputText
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.rightIcon} />
      </div>
    </div>
  );
}
