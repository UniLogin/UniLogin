export const getNameFromEmail = (email: string) => email.split('@')[0].replace(/\b\w/g, c => c.toUpperCase());
