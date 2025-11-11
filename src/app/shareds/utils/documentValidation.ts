import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const isValidCnpj = (cnpj: string) => {
  const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let n = 0;
  if (/0{14}/.test(cnpj)) return false;
  for (let i = 0, n = 0; i < 12; n += Number(cnpj[i]) * b[++i]);
  if (Number(cnpj[12]) !== ((n %= 11) < 2 ? 0 : 11 - n)) return false;
  for (let i = 0, n = 0; i <= 12; n += Number(cnpj[i]) * b[i++]);
  if (Number(cnpj[13]) !== ((n %= 11) < 2 ? 0 : 11 - n)) return false;
  return true;
};

const isValidCPF = (cpf: string) => {
  if (!!cpf.match(/(\d)\1{10}/)) return false;
  const cpfArray = cpf.split('');
  const validator = cpfArray
    .filter((digit, index, array) => index >= array.length - 2 && digit)
    .map((el) => +el);
  const toValidate = (pop: number) =>
    cpfArray
      .filter((digit, index, array) => index < array.length - pop && digit)
      .map((el) => +el);
  const rest = (count: number, pop: number) =>
    ((toValidate(pop).reduce((soma, el, i) => soma + el * (count - i), 0) *
      10) %
      11) %
    10;
  return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1]);
};

export const isValidCpfOrCnpj = (documentNumber: string) => {
  const cpfCnpj = documentNumber.replace(/[^\d]+/g, '');

  if (cpfCnpj.length === 11) {
    return isValidCPF(cpfCnpj);
  } else if (cpfCnpj.length === 14) {
    return isValidCnpj(cpfCnpj);
  } else {
    return false;
  }
};

export function documentValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const document: string = control.value;

    if (!document) {
      // Deixa a validação de 'required' cuidar disso.
      return null;
    }

    // Remove caracteres não numéricos antes de validar (conforme a função)
    const cleanedDocument = document.replace(/[^\d]+/g, '');

    if (cleanedDocument.length !== 11 && cleanedDocument.length !== 14) {
      // Não é um CPF (11) ou CNPJ (14)
      return { invalidDocumentLength: true };
    }

    if (!isValidCpfOrCnpj(document)) {
      return { invalidDocument: true };
    }

    return null; // Válido
  };
}
