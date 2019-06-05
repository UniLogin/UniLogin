import {TEST_ACCOUNT_ADDRESS, createSignedMessage} from '@universal-login/commons';


export const testPrivateKey = '0x63f01680950dc70f2eb8f373de0c360fcbb89ef437f2f6f2f0a1797979e490a4';
export const getSignedMessage = async () => createSignedMessage({from: TEST_ACCOUNT_ADDRESS, to: TEST_ACCOUNT_ADDRESS}, testPrivateKey);

export default getSignedMessage;
