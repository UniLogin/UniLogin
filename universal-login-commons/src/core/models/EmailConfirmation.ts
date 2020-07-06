export interface EmailConfirmation {
  email: string;
  ensName: string;
  code: string;
  created_at: Date;
  isConfirmed: boolean;
}
