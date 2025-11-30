"use client";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/cadastrarVenda.module.css";

export default function DropdownSelect({
  label,
  placeholder,
  lista,
  value,
  onChange,
  selectedId,
  onSelect,
  onClear,
  allowNew = false,
  onNewClick,
}) {
  const [busca, setBusca] = useState(value || "");
  const containerRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setBusca(value || "");
  }, [value]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLista = lista.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={styles.inlineSearch} ref={containerRef}>
      <label className={styles.titulo}>{label}</label>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            onChange && onChange(e.target.value);
            onSelect && onSelect(null); // limpa seleção enquanto digita
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        {allowNew && onNewClick && (
          <button className={styles.botaoRoxo} onClick={onNewClick}>
            Novo
          </button>
        )}
      </div>

      {selectedId && (
        <div className={styles.clienteSelecionado}>
          <span>
            Selecionado: <strong>{busca}</strong>
          </span>
          <button
            className={styles.removerCliente}
            onClick={() => {
              onClear && onClear();
              setBusca("");
              setShowDropdown(false);
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      {showDropdown && !selectedId && (
        <div className={styles.dropdown}>
          {filteredLista.map((item) => (
            <div
              key={item.id}
              className={styles.dropdownItem}
              onClick={() => {
                onSelect(item.id);
                setBusca(item.nome);
                setShowDropdown(false);
              }}
            >
              {item.nome} (ID: {item.id})
            </div>
          ))}
          {filteredLista.length === 0 && (
            <div className={styles.dropdownItemDisabled}>Nenhum encontrado</div>
          )}
        </div>
      )}
    </div>
  );
}
