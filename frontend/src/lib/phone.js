export const toAustralianE164 = (input) => {
  if (!input) {
    throw new Error("Phone number is required");
  }

  const normalized = input.replace(/\s+/g, "");
  if (/^\+61\d{8,9}$/.test(normalized)) {
    return normalized;
  }

  let digits = normalized.replace(/[^\d]/g, "");

  if (digits.startsWith("061")) {
    digits = digits.slice(1);
  }

  if (digits.startsWith("61")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (!/^\d{8,9}$/.test(digits)) {
    throw new Error("Enter a valid Australian mobile number");
  }

  return `+61${digits}`;
};
