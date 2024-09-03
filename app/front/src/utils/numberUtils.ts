export function formatNumber(value: number): string {
    const [integerPart, decimalPart = ''] = value.toString().split('.');
    const formattedIntegerPart = integerPart.padStart(1, '0').slice(0, 1) + 's';
    const formattedDecimalPart = decimalPart.padEnd(3, '0').slice(0, 3);
    return formattedIntegerPart + formattedDecimalPart;
}
