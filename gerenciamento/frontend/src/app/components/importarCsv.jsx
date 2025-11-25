"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import styles from "../styles/importarCsv.module.css";

export default function ImportarCSV({ onClose }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(""); // mensagem de erro
  const [target, setTarget] = useState("produtos");
  const [delimiter, setDelimiter] = useState(",");
  const [mapping, setMapping] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [detectedHeaders, setDetectedHeaders] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const p = pathname.toLowerCase();
    if (p.includes('produtos')) setTarget('produtos');
    else if (p.includes('fornecedor') || p.includes('fornecedores')) setTarget('fornecedores');
    else if (p.includes('cliente') || p.includes('clientes')) setTarget('clientes');
    else if (p.includes('funcionario') || p.includes('funcionarios')) setTarget('funcionarios');
    else if (p.includes('financeiro')) setTarget('transacoes_financeiras');
    else if (p.includes('cupon')) setTarget('cupons');
    else if (p.includes('servico') || p.includes('servicos')) setTarget('servicos_personalizados');
    else if (p.includes('venda') || p.includes('vendas')) setTarget('vendas');
  }, [pathname]);

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
      // read header to propose mapping
      readHeaderAndAutoMap(arquivo, delimiter, target);
    }
  };

  const readHeaderAndAutoMap = (arquivo, delim, tabela) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const firstLine = text.split(/\r?\n/)[0] || '';
      const headers = firstLine.split(delim).map(h => h.trim().replace(/^\"|\"$/g, ''));
      setDetectedHeaders(headers);
      // fetch table columns from backend
      try {
        const res = await fetch(`http://localhost:5000/colunas_tabela?table=${tabela}`);
        const json = await res.json();
        if (res.ok && json && json.colunas) {
          const cols = json.colunas;
          const autoMap = computeAutoMapping(headers, cols);
          setMapping(JSON.stringify(autoMap, null, 2));
        } else {
          // fallback mapping based on headers -> snake_case
          const fallback = {};
          headers.forEach(h => { fallback[h] = toSnakeCase(h); });
          setMapping(JSON.stringify(fallback, null, 2));
        }
      } catch (err) {
        const fallback = {};
        headers.forEach(h => { fallback[h] = toSnakeCase(h); });
        setMapping(JSON.stringify(fallback, null, 2));
      }
    };
    reader.readAsText(arquivo, 'utf-8');
  };

  const normalize = (s) => {
    if (!s) return '';
    return s
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
  };

  const toSnakeCase = (s) => {
    if (!s) return '';
    return s
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const computeAutoMapping = (headers, cols) => {
    const normCols = cols.map(c => ({ raw: c, norm: normalize(c) }));
    const mappingObj = {};
    headers.forEach(h => {
      const hn = normalize(h);
      // exact match
      let found = normCols.find(c => c.norm === hn);
      if (!found) {
        // find by inclusion
        found = normCols.find(c => c.norm.includes(hn) || hn.includes(c.norm));
      }
      if (found) mappingObj[h] = found.raw;
      else mappingObj[h] = toSnakeCase(h);
    });
    return mappingObj;
  };

  const handleSubmit = () => {
    if (!file) {
      setError("Nenhum arquivo selecionado!");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('target', target);
    if (mapping) formData.append('mapping', mapping);
    if (delimiter) formData.append('delimiter', delimiter);

    fetch('http://localhost:5000/importar_csv', {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = (json && json.detalhes) || (json && json.message) || 'Erro ao importar';
          setError(msg);
          setResult(json);
        } else {
          setResult(json);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Erro na requisição: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleAutoMapClick = () => {
    if (!file) {
      setError('Selecione um arquivo para auto-mapping');
      return;
    }
    readHeaderAndAutoMap(file, delimiter, target);
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

        <div className={styles.optionsRow}>
          <label>
            Tabela alvo:
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="produtos">produtos</option>
              <option value="clientes">clientes</option>
              <option value="fornecedores">fornecedores</option>
              <option value="funcionarios">funcionarios</option>
              <option value="transacoes_financeiras">transacoes_financeiras</option>
              <option value="cupons">cupons</option>
              <option value="servicos_personalizados">servicos_personalizados</option>
              <option value="vendas">vendas</option>
            </select>
          </label>

          <label>
            Delimitador:
            <input
              type="text"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              maxLength={1}
              style={{ width: '40px', marginLeft: '6px' }}
            />
          </label>
        </div>

        <label className={styles.mappingLabel}>
          Mapping (opcional) JSON: <small>Ex: {`{"Nome":"nome","Preco":"preco"}`}</small>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button type="button" onClick={handleAutoMapClick} className={styles.submitBtn}>Auto map</button>
            <span style={{ alignSelf: 'center' }}>
              {detectedHeaders ? `Cabeçalhos detectados: ${detectedHeaders.join(', ')}` : 'Nenhum cabeçalho detectado ainda'}
            </span>
          </div>
          <textarea
            value={mapping}
            onChange={(e) => setMapping(e.target.value)}
            placeholder='{"Nome":"nome","Preco":"preco"}'
            rows={3}
            style={{ width: '100%', marginTop: '6px' }}
          />
        </label>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleSubmit} className={styles.submitBtn} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
          <button onClick={onClose} className={styles.submitBtn} style={{ background: '#ccc' }}>
            Fechar
          </button>
        </div>

        {result && (
          <div className={styles.resultBox} style={{ marginTop: '12px' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
