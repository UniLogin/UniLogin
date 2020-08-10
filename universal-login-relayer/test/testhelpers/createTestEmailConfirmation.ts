interface CreateTestEmailConfirmationProps {
  email?: string;
  code?: string;
  ensName?: string;
  isConfirmed?: boolean;
}

export const createTestEmailConfirmation = ({
  email = 'account@unilogin.test',
  code = '012345',
  ensName = 'account.unilogin.test',
  isConfirmed = false,
}: CreateTestEmailConfirmationProps) => ({
  email,
  code,
  ensName,
  createdAt: new Date(),
  isConfirmed,
});
