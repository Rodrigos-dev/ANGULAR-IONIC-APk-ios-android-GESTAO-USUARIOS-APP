const unmask = (str: string): string => str.replace(/[-)./(+ ]/g, '');

const unmaskPrice = (value: string): number =>
  value ? Number(value.replace(/\D/g, '')) / 100 : 0;

const mask = (str: string, ...masks: any[]): string => {
  const auxMask =
    masks.find((it) => unmask(it).length >= unmask(str).length) ||
    masks.sort((a, b) => unmask(a).length - unmask(b).length).pop();

  if (!auxMask) return str;

  let auxStr = unmask(str);
  const maskLength = unmask(auxMask).length;
  if (auxStr.length > maskLength) {
    auxStr = str.substring(0, maskLength);
  }
  let maskedStr = '';
  let j = 0;
  for (const element of auxStr) {
    try {
      while (auxMask[j] && auxMask[j] !== '#') maskedStr += auxMask[j++];
      maskedStr += element;
      j++;
    } catch {
      break;
    }
  }

  return maskedStr;
};

const maskTelephone = (cellPhone: string): string => {
  return mask(
    cellPhone.replace(/\D/g, ''),
    '(##) ####-####',
    '(##) # ####-####'
  );
};

const maskPostalCode = (postalCode: string): string => {
  return mask(postalCode.replace(/\D/g, ''), '##.###-###');
};

const maskCpf = (document: string): string => {
  return mask(document.replace(/\D/g, ''), '###.###.###-##');
};

const maskCnpj = (document: string): string => {
  return mask(document.replace(/\D/g, ''), '##.###.###/####-##');
};

const maskRg = (document: string): string => {
  return mask(document.replace(/\D/g, ''), '##.###.###-#');
};

const maskWeight = (weight: string): string => {
  return mask(
    weight.replace(/\D/g, ''),
    '#.###',
    '##.###',
    '###.###',
    '####.###',
    '#####.###'
  );
};

const maskMeasure = (measure: string): string => {
  return mask(measure.replace(/\D/g, ''), '#.###', '##.###', '###.###');
};

const maskPlate = (plate: string): string => {
  if (!plate) return '';
  const cleanedValue = plate.replace(/[^a-zA-Z0-9]/g, '');
  const firstPart = cleanedValue.slice(0, 3).toUpperCase();
  const secondPart = cleanedValue.slice(3, 7).toUpperCase();

  let maskedValue = '';
  if (firstPart) {
    maskedValue += firstPart;
  }
  if (secondPart) {
    maskedValue += '-' + secondPart;
  }
  return maskedValue;
};

export const maskUtils = {
  unmask,
  unmaskPrice,
  mask,
  maskTelephone,
  maskPlate,
  maskPostalCode,
  maskCpf,
  maskCnpj,
  maskRg,
  maskWeight,
  maskMeasure,
};
