import { maskUtils } from './masks'; // Importa as máscaras originais

/**
 * Função utilitária para aplicar uma máscara de segurança parcial (primeiros N, últimos M)
 * a um valor, mantendo os caracteres de formatação (pontos, traços).
 * * @param unmaskedValue O valor numérico limpo (apenas dígitos).
 * @param fullMaskFunction A função original do maskUtils para aplicar a formatação (ex: maskCpf).
 * @param visibleStart O número de dígitos visíveis no início.
 * @param visibleEnd O número de dígitos visíveis no final.
 * @returns O valor formatado com a parte central substituída por asteriscos.
 */
const _maskPartial = (
  unmaskedValue: string,
  fullMaskFunction: (value: string) => string,
  visibleStart: number,
  visibleEnd: number
): string => {
  if (!unmaskedValue) return '';

  // 1. Aplica a máscara completa (ex: 123.456.789-00)
  const fullMaskedValue = fullMaskFunction(unmaskedValue);
  const totalDigits = unmaskedValue.length; // 11 para CPF, 14 para CNPJ

  if (totalDigits < visibleStart + visibleEnd) {
    // Se o valor é muito curto, não aplica a máscara de segurança.
    return fullMaskedValue;
  }

  let safeMask = '';
  let digitCount = 0;

  // 2. Itera sobre o valor formatado para aplicar os asteriscos.
  for (let char of fullMaskedValue) {
    if (/\d/.test(char)) {
      // Se o caractere for um dígito
      digitCount++;

      // Condição para ESCONDER o dígito: está na parte do meio
      const isHiddenArea =
        digitCount > visibleStart && digitCount <= totalDigits - visibleEnd;

      if (isHiddenArea) {
        safeMask += '*'; // Substitui por asterisco
      } else {
        safeMask += char; // Mantém o dígito visível
      }
    } else {
      // Se não for um dígito (ponto, traço, barra), mantém o caractere de máscara
      safeMask += char;
    }
  }

  return safeMask;
};

/**
 * Aplica máscara de segurança parcial ao CPF (Exibe 2 primeiros e 2 últimos dígitos).
 */
const maskCpfSafe = (document: string): string => {
  const unmasked = maskUtils.unmask(document);
  // CPF (11 dígitos): Mostra 2 no início e 2 no final
  return _maskPartial(unmasked, maskUtils.maskCpf, 2, 2);
};

/**
 * Aplica máscara de segurança parcial ao CNPJ (Exibe 2 primeiros e 2 últimos dígitos).
 */
const maskCnpjSafe = (document: string): string => {
  const unmasked = maskUtils.unmask(document);
  // CNPJ (14 dígitos): Mostra 2 no início e 2 no final
  return _maskPartial(unmasked, maskUtils.maskCnpj, 2, 2);
};

export const maskSafeUtils = {
  maskCpfSafe,
  maskCnpjSafe,
};
