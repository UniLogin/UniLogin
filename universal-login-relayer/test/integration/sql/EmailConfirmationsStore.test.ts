import {getKnexConfig} from '../../testhelpers/knex';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EmailConfirmation, sleep} from '@unilogin/commons';
import {expect} from 'chai';

describe('UNIT: EmailConfirmationsStore', () => {
  const knex = getKnexConfig();
  const emailConfirmationsStore = new EmailConfirmationsStore(knex);

  it('Should add emailConfirmation to database and get it from it', async () => {
    const storedEmail = 'newEmail@email.com';
    const storedEmailConfirmation = {
      email: storedEmail,
      ensName: 'bob.unilogin.eth',
      code: '1234',
      isConfirmed: false,
      created_at: new Date(),
    } as EmailConfirmation;

    const [email] = await emailConfirmationsStore.add(storedEmailConfirmation);
    expect(email).be.deep.eq(storedEmail);
    expect(await emailConfirmationsStore.get(email)).be.deep.eq(storedEmailConfirmation);
  });

  it('Should add two emailConfirmations to database and get the second one', async () => {
    const storedEmail = 'newEmail@email.com';
    const storedEmailConfirmation = {
      email: storedEmail,
      ensName: 'bob.unilogin.eth',
      code: '1234',
      isConfirmed: false,
      created_at: new Date(),
    } as EmailConfirmation;

    let [email] = await emailConfirmationsStore.add(storedEmailConfirmation);
    expect(email).be.deep.eq(storedEmail);

    await sleep(1);
    const secondStoredEmailConfirmation = {
      email: storedEmail,
      ensName: 'bob2.unilogin.eth',
      code: '4321',
      isConfirmed: false,
      created_at: new Date(),
    } as EmailConfirmation;

    [email] = await emailConfirmationsStore.add(secondStoredEmailConfirmation);
    expect(email).be.deep.eq(storedEmail);
    expect(await emailConfirmationsStore.get(email)).be.deep.eq(secondStoredEmailConfirmation);
  });
});
