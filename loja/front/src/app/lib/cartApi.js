// lib/cartApi.js
const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://127.0.0.1:5000";

function cartKey(userId) {
  return `cart:${userId}`;
}

/** Normaliza "0,50", "0.50", "1.234,56", "1,234.56" -> Number em reais */
function normalizePrice(v) {
  if (v == null) return undefined;
  if (typeof v === "number" && Number.isFinite(v)) return v;

  let s = String(v).trim();

  // Se tiver vírgula e não tiver ponto => vírgula é decimal pt-BR
  if (s.includes(",") && !s.includes(".")) {
    s = s.replace(/\./g, ""); // remove milhares pt-BR
    s = s.replace(",", "."); // vírgula -> ponto decimal
  } else {
    // Caso com ponto decimal (en-US) ou misto: remova vírgulas de milhar
    s = s.replace(/,/g, "");
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

async function ensureCart(userId) {
  if (!userId) throw new Error("userId inválido");

  // tenta cache local
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cartKey(userId));
    if (cached) return Number(cached);
  }

  // busca por usuário
  let res = await fetch(`${BASE}/carrinho/usuario/${userId}`, {
    cache: "no-store",
  });
  if (res.ok) {
    const c = await res.json();
    if (typeof window !== "undefined")
      localStorage.setItem(cartKey(userId), String(c.id));
    return Number(c.id);
  }

  // cria
  res = await fetch(`${BASE}/criar_carrinho`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUsuario: userId }),
  });
  if (!res.ok) throw new Error(`Falha ao criar carrinho: ${await res.text()}`);
  const data = await res.json();
  const carrinho = data?.carrinho || data;
  if (typeof window !== "undefined")
    localStorage.setItem(cartKey(userId), String(carrinho.id));
  return Number(carrinho.id);
}

export async function getCartByUser(userId) {
  const res = await fetch(`${BASE}/carrinho/usuario/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // {id, idUsuario, produtos:[{produto_id, quantidade, preco_unitario}], valorTotal}
}

export async function addItem(userId, { produtoId, quantidade = 1, preco }) {
  const cartId = await ensureCart(userId);

  // ✅ garante preço em REAIS (0.50) independente do formato recebido
  const precoNormalizado = normalizePrice(preco);

  const body = {
    produto_id: Number(produtoId),
    quantidade: Number(quantidade),
    ...(precoNormalizado != null
      ? { preco_unitario: Number(precoNormalizado) }
      : {}),
  };

  const res = await fetch(`${BASE}/carrinho/${cartId}/adicionar_item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let json;
  try {
    json = await res.json();
  } catch {
    json = { message: await res.text() };
  }
  if (!res.ok) throw new Error(json?.message || "Erro ao adicionar item");
  return json; // {message|resultado, carrinho?}
}

export async function removeItem(userId, produtoId) {
  const cartId = await ensureCart(userId);
  const res = await fetch(
    `${BASE}/carrinho/${cartId}/remover_item/${produtoId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateItem(userId, { produtoId, quantidade }) {
  const cartId = await ensureCart(userId);
  const res = await fetch(`${BASE}/carrinho/${cartId}/atualizar_item`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      produto_id: Number(produtoId),
      quantidade: Number(quantidade),
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
