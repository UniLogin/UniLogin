export const formatCrypto = (crypto: string, places: number) => {
  return parseFloat(crypto).toFixed(places);
}