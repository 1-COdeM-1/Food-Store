export function formatPrice(price: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function calculateDiscount(price: number, discount?: number): number {
  if (!discount || discount <= price) return 0;
  return Math.round(((discount - price) / discount) * 100);
}

export function generateWhatsAppUrl(
  phoneNumber: string,
  productName: string,
  productPrice: number,
  locale: string = 'en'
): string {
  let cleanPhone = phoneNumber.replace(/\D/g, '');

  // If number starts with 0, assume Egypt (+20) and replace leading 0 with country code
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '20' + cleanPhone.slice(1);
  }

  const message =
    locale === 'ar'
      ? `مرحباً، أود الاستفسار عن المنتج: ${productName} - السعر: $${productPrice}`
      : `Hello, I would like to inquire about: ${productName} - Price: $${productPrice}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function normalizeArabicText(text: string): string {
  return text
    .replace(/[أإآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase()
    .trim();
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
