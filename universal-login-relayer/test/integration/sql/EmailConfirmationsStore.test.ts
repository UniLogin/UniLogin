import {getKnexConfig} from '../../testhelpers/knex';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EmailConfirmation, sleep} from '@unilogin/commons';
import {expect} from 'chai';

describe('UNIT: EmailConfirmationsStore', () => {
  const knex = getKnexConfig();
  const emailConfirmationsStore = new EmailConfirmationsStore(knex);

  it('Should add emailConfirmation to database and get it from it', async () => {
    const exampleEmail = 'newEmail@email.com';
    const emailConfirmation: EmailConfirmation = {
      email: exampleEmail,
      ensName: 'bob.unilogin.eth',
      code: '1234',
      isConfirmed: false,
      createdAt: new Date(),
    };

    const email = await emailConfirmationsStore.add(emailConfirmation);
    expect(email).be.deep.eq(exampleEmail);
    expect(await emailConfirmationsStore.get(email)).be.deep.eq(emailConfirmation);
  });

  it('Should add two emailConfirmations to database and get the second one', async () => {
    const exampleEmail = 'newEmail@email.com';
    const currentDate = new Date();
    const emailConfirmation: EmailConfirmation = {
      email: exampleEmail,
      ensName: 'bob.unilogin.eth',
      code: '1234',
      isConfirmed: false,
      createdAt: currentDate,
    };

    const email = await emailConfirmationsStore.add(emailConfirmation);
    expect(email).be.deep.eq(exampleEmail);

    const secondEmailConfirmation: EmailConfirmation = {
      email: exampleEmail,
      ensName: 'bob.unilogin.eth',
      code: '4321',
      isConfirmed: false,
      createdAt: new Date(currentDate.getTime() + 10),
    };

    const email2 = await emailConfirmationsStore.add(secondEmailConfirmation);
    expect(email2).be.deep.eq(exampleEmail);
    expect(await emailConfirmationsStore.get(email2)).be.deep.eq(secondEmailConfirmation);
  });
});
