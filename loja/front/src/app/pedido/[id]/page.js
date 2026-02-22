// src/app/pedido/[id]/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import DetalhesPedido from "@/app/components/detalhesPedido";

export default function Page() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("dados");

  if (!encoded) {
    return <h2 style={{ padding: 40 }}>Nenhum dado recebido.</h2>;
  }

  let pedido = null;
  try {
    pedido = JSON.parse(encoded);
  } catch (e) {
    return <h2 style={{ padding: 40 }}>Erro ao decodificar dados.</h2>;
  }

  if (!pedido) {
    return <h2 style={{ padding: 40 }}>Pedido não carregado.</h2>;
  }

  return <DetalhesPedido pedido={pedido} />;
}
