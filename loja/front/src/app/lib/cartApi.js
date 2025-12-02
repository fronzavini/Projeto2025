// src/app/lib/cartApi.js
// Único módulo com TUDOOO do carrinho + helpers de backend (compatível com seus componentes).

/* =======================
 * Config
 * ======================= */
export const BACKEND_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://127.0.0.1:5000";

// alias de compatibilidade com código antigo
export const BASE = BACKEND_URL;

/* =======================
 * Utils de preço e moeda
 * ======================= */
export function normalizePrice(v) {
  if (v == null) return 0;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  let s = String(v).trim();
  // pt-BR: "1.234,56"
  if (s.includes(",") && !s.includes(".")) {
    s = s.replace(/\./g, ""); // milhares
    s = s.replace(",", "."); // decimal
  } else {
    // en-US/misto: remove vírgulas de milhar
    s = s.replace(/,/g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export function formatBRL(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(n);
}

/* =======================
 * Storage de usuário/token
 * ======================= */
const USER_LOJA_KEY = "usuario_loja";
const ID_USUARIO_KEY = "idUsuario";
const TOKEN_SISTEMA_KEY = "token_sistema";
const TOKEN_LOJA_KEY = "token_loja";

export function getUserIdFromStorage() {
  try {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem(USER_LOJA_KEY)
        : null;
    const obj = raw ? JSON.parse(raw) : null;
    return (
      obj?.id ||
      (typeof window !== "undefined"
        ? Number(localStorage.getItem(ID_USUARIO_KEY))
        : null)
    );
  } catch {
    return null;
  }
}

export function setUserToStorage(userObj) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_LOJA_KEY, JSON.stringify(userObj || {}));
    if (userObj?.id != null) {
      localStorage.setItem(ID_USUARIO_KEY, String(userObj.id));
    }
  } catch {}
}

export function clearUserStorage() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_LOJA_KEY);
    localStorage.removeItem(ID_USUARIO_KEY);
  } catch {}
}

// Tokens opcionais (seu back usa JWT em /login_sistema e /login_loja)
export function setSistemaToken(token) {
  try {
    if (typeof window !== "undefined")
      localStorage.setItem(TOKEN_SISTEMA_KEY, token || "");
  } catch {}
}
export function getSistemaToken() {
  try {
    return typeof window !== "undefined"
      ? localStorage.getItem(TOKEN_SISTEMA_KEY) || ""
      : "";
  } catch {
    return "";
  }
}
export function setLojaToken(token) {
  try {
    if (typeof window !== "undefined")
      localStorage.setItem(TOKEN_LOJA_KEY, token || "");
  } catch {}
}
export function getLojaToken() {
  try {
    return typeof window !== "undefined"
      ? localStorage.getItem(TOKEN_LOJA_KEY) || ""
      : "";
  } catch {
    return "";
  }
}

/* =======================
 * Fetch helpers
 * ======================= */
function buildHeaders(extra, authToken) {
  const base = { "Content-Type": "application/json" };
  const h = { ...base, ...(extra || {}) };
  if (authToken) h.Authorization = `Bearer ${authToken}`;
  return h;
}

/**
 * fetchJson simples (GET por padrão). Lança erro se !ok.
 * params:
 *  - auth: "sistema" | "loja" | string token direto | false
 *  - method, headers, body, ...fetchInit
 */
export async function getJson(url, init = {}) {
  const token =
    init.auth === "sistema"
      ? getSistemaToken()
      : init.auth === "loja"
      ? getLojaToken()
      : typeof init.auth === "string"
      ? init.auth
      : "";

  const res = await fetch(url, {
    cache: "no-store",
    method: init.method || "GET",
    headers: buildHeaders(init.headers, token),
    body: init.body,
    ...init,
  });
  if (!res.ok) {
    let msg;
    try {
      const j = await res.json();
      msg = j?.detalhes || j?.erro || j?.message || JSON.stringify(j);
    } catch {
      msg = await res.text();
    }
    throw new Error(`HTTP ${res.status}: ${msg || "Falha na requisição"}`);
  }
  return res.json();
}

/**
 * tryJson: não lança erro; retorna { ok, status, data, errorText }
 * útil quando o back pode retornar 404/400 e você quer tratar.
 */
export async function tryJson(url, init = {}) {
  const token =
    init.auth === "sistema"
      ? getSistemaToken()
      : init.auth === "loja"
      ? getLojaToken()
      : typeof init.auth === "string"
      ? init.auth
      : "";

  try {
    const res = await fetch(url, {
      cache: "no-store",
      method: init.method || "GET",
      headers: buildHeaders(init.headers, token),
      body: init.body,
      ...init,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data,
        errorText:
          data?.detalhes || data?.erro || data?.message || (await res.text?.()),
      };
    }
    return { ok: true, status: res.status, data, errorText: null };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      data: null,
      errorText: String(e?.message || e),
    };
  }
}

export function postJson(url, body, init = {}) {
  return getJson(url, {
    ...init,
    method: "POST",
    body: JSON.stringify(body ?? {}),
  });
}
export function putJson(url, body, init = {}) {
  return getJson(url, {
    ...init,
    method: "PUT",
    body: JSON.stringify(body ?? {}),
  });
}
export function patchJson(url, body, init = {}) {
  return getJson(url, {
    ...init,
    method: "PATCH",
    body: JSON.stringify(body ?? {}),
  });
}
export async function deleteJson(url, init = {}) {
  const res = await getJson(url, { ...init, method: "DELETE" });
  return res;
}

/* =======================
 * Carrinho — TODAS as funções
 * ======================= */
export function cartKey(userId) {
  return `cart:${userId}`;
}

/** Garante que exista um carrinho para o userId e retorna o id do carrinho */
async function ensureCart(userId) {
  if (!userId) throw new Error("userId inválido");

  // tenta cache local
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cartKey(userId));
    if (cached) return Number(cached);
  }

  // busca por usuário
  let res = await fetch(`${BACKEND_URL}/carrinho/usuario/${userId}`, {
    cache: "no-store",
  });
  if (res.ok) {
    const c = await res.json();
    if (typeof window !== "undefined")
      localStorage.setItem(cartKey(userId), String(c.id));
    return Number(c.id);
  }

  // cria se não existir
  res = await fetch(`${BACKEND_URL}/criar_carrinho`, {
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

/** Lê o carrinho completo do usuário (shape do seu backend) */
export async function getCartByUser(userId) {
  const res = await fetch(`${BACKEND_URL}/carrinho/usuario/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // {id, idUsuario, produtos:[{produto_id, quantidade, preco_unitario}], valorTotal}
}

/** Adiciona item no carrinho do usuário */
export async function addItem(userId, { produtoId, quantidade = 1, preco }) {
  const cartId = await ensureCart(userId);

  // garante preço em reais (0.50) independente do formato recebido
  const precoNormalizado = normalizePrice(preco);

  const body = {
    produto_id: Number(produtoId),
    quantidade: Number(quantidade),
    ...(precoNormalizado != null
      ? { preco_unitario: Number(precoNormalizado) }
      : {}),
  };

  const res = await fetch(`${BACKEND_URL}/carrinho/${cartId}/adicionar_item`, {
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
  if (!res.ok)
    throw new Error(
      json?.detalhes || json?.message || "Erro ao adicionar item"
    );
  return json; // {resultado:"ok", carrinho:{...}}
}

/** Remove item do carrinho do usuário */
export async function removeItem(userId, produtoId) {
  const cartId = await ensureCart(userId);
  const res = await fetch(
    `${BACKEND_URL}/carrinho/${cartId}/remover_item/${produtoId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Atualiza quantidade (idempotente) no carrinho do usuário */
export async function updateItem(userId, { produtoId, quantidade }) {
  const cartId = await ensureCart(userId);
  const res = await fetch(`${BACKEND_URL}/carrinho/${cartId}/atualizar_item`, {
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

/* =======================
 * Helpers de domínio (atalhos)
 * ======================= */

// Carrega carrinho do usuário
export async function fetchCarrinhoByUser(idUsuario) {
  return getJson(`${BACKEND_URL}/carrinho/usuario/${idUsuario}`);
}

// Enriquecer item do carrinho com dados do produto (nome/imagem/preço se faltar)
export async function enrichProduto(produtoId) {
  const prod = await tryJson(`${BACKEND_URL}/produto_id/${produtoId}`);
  if (!prod.ok) return null;
  return prod.data;
}

// Aplica cupom usando seu endpoint; devolve objeto direto do backend
export async function aplicarCupom(valor_total, codigo_cupom) {
  return postJson(`${BACKEND_URL}/calcular_desconto`, {
    valor_total,
    codigo_cupom,
  });
}

// PIX — cria pagamento (usa o shape do seu backend atual)
export async function criarPixPayment({ order_id, amount, email }) {
  return postJson(`${BACKEND_URL}/create_pix_payment`, {
    order_id,
    amount,
    email,
  });
}
