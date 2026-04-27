const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

export function formatCpf(value) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatPlate(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 7);
}

export function formatMoneyInput(value) {
  const digits = onlyDigits(value);

  if (!digits) {
    return "";
  }

  return moneyFormatter.format(Number(digits) / 100);
}

export function formatMoneyValue(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return moneyFormatter.format(Number(value));
}

export function parseMoneyToNumber(value) {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return undefined;
  }

  const normalized = String(value).replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? undefined : parsed;
}
