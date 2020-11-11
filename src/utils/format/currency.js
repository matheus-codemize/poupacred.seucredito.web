import language from '../language';
const { locale, currencyType } = language;

export default function (value) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyType,
    minimumFractionDigits: 2,
  }).format(value);
}
