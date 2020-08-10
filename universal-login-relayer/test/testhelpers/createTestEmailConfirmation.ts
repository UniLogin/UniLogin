interface CreateTestEmailConfirmationProps {
  email?: string;
  code?: string;
  ensName?: string;
  isConfirmed?: boolean;
  createdAt?: Date;
}

export const createTestEmailConfirmation = ({
  email = 'account@unilogin.test',
  code = '012345',
  ensName = 'account.unilogin.test',
  isConfirmed = false,
  createdAt = new Date(),
}: CreateTestEmailConfirmationProps) => ({
  email,
  code,
  ensName,
  createdAt,
  isConfirmed,
});
