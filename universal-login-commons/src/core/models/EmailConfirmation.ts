export interface EmailConfirmation {
  email: string;
  ensName: string;
  code: string;
  createdAt: Date;
  isConfirmed: boolean;
}
