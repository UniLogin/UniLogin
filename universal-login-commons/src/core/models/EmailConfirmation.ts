export interface EmailConfirmation {
  email: string;
  ensName: string;
  code: string;
  isConfirmed?: boolean;
}
