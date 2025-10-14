import React, { useState } from "react";
import styles from "../styles/importarCsv.module.css";

export default function ImportarCSV({ onClose }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(""); // mensagem de erro

  const validarCSV = (arquivo) => {
    const extensao = arquivo.name.split(".").pop().toLowerCase();
    if (extensao !== "csv") {
      setError("Por favor, envie um arquivo CSV válido (.csv)");
      return false;
    }
    setError(""); // limpa erro se válido
    return true;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const arquivo = event.dataTransfer.files[0];
      if (validarCSV(arquivo)) setFile(arquivo);
    }
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") setDragActive(true);
    else if (event.type === "dragleave") setDragActive(false);
  };

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const arquivo = event.target.files[0];
      if (validarCSV(arquivo)) setFile(arquivo);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      setError("Nenhum arquivo selecionado!");
      return;
    }
    setError("");
    console.log("Arquivo CSV:", file);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeBtn}>
          ✕
        </button>

        <h2 className={styles.title}>Importar CSV</h2>

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`${styles.dropArea} ${dragActive ? styles.active : ""}`}
        >
          <p>Arraste o arquivo CSV aqui <br /> ou clique para selecionar</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleChange}
            className={styles.fileInput}
          />
        </div>

        {file && <p className={styles.fileName}>Selecionado: {file.name}</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}

        <button onClick={handleSubmit} className={styles.submitBtn}>
          Enviar
        </button>
      </div>
    </div>
  );
}
