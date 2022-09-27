export const kFormatter = (num: number): string => {
  const fixed = ((Math.abs(num)/1000));
  const format = Math.abs(num) > 999 
  ?( Math.sign(num) * fixed).toFixed(0) + 'k' 
  : Math.sign(num) * Math.abs(num) + '';
  return format;
}

export const strToNum = (str: string): number => parseFloat(str.replace(/,/g, ''));