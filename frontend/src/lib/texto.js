const RANGO_DIACRITICOS = new RegExp("[\\u0300-\\u036f]", "g");

export function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(RANGO_DIACRITICOS, "")
    .toLowerCase();
}
