import {getKnexConfig} from '../../testhelpers/knex';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EmailConfirmation} from '@unilogin/commons';
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
    } as EmailConfirmation;

    const [email] = await emailConfirmationsStore.add(storedEmailConfirmation);
    expect(email).be.deep.eq(storedEmail);
    expect(await emailConfirmationsStore.get(email)).be.deep.eq({...storedEmailConfirmation, isConfirmed: false});
  });

  it('Should add two emailConfirmations to database and get the second one', async () => {
    const storedEmail = 'newEmail@email.com';
    const storedEmailConfirmation = {
      email: storedEmail,
      ensName: 'bob.unilogin.eth',
      code: '1234',
    } as EmailConfirmation;
    const secondStoredEmailConfirmation = {
      email: storedEmail,
      ensName: 'bob2.unilogin.eth',
      code: '4321',
    } as EmailConfirmation;

    let [email] = await emailConfirmationsStore.add(storedEmailConfirmation);
    expect(email).be.deep.eq(storedEmail);
    [email] = await emailConfirmationsStore.add(secondStoredEmailConfirmation);
    expect(email).be.deep.eq(storedEmail);
    expect(await emailConfirmationsStore.get(email)).be.deep.eq({...secondStoredEmailConfirmation, isConfirmed: false});
  });
});
