"use client";
import { useState, useRef, useEffect } from "react";
import styles from "../../styles/cadastrarVenda.module.css";

export default function DropdownProduto({
  lista,
  onAdicionar,
  placeholder = "Pesquisar produto...",
}) {
  const [busca, setBusca] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

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

  const filteredLista = lista.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleAdicionar = (produto) => {
    if (!produto) return;
    onAdicionar({ ...produto, quantidade });
    setBusca("");
    setQuantidade(1);
    setShowDropdown(false);
  };

  return (
    <div className={styles.novoProdutoForm} ref={containerRef}>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && busca && (
        <div className={styles.dropdown}>
          {filteredLista.length > 0 ? (
            filteredLista.map((p) => (
              <div
                key={p.id}
                className={styles.dropdownItem}
                onClick={() => handleAdicionar(p)}
              >
                {p.nome} - R${p.preco.toFixed(2)}
              </div>
            ))
          ) : (
            <div className={styles.dropdownItemDisabled}>Nenhum produto</div>
          )}
        </div>
      )}
    </div>
  );
}
