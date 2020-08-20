import {expect} from 'chai';
import {EmailConfirmation} from '@unilogin/commons';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {getKnexConfig} from '../../testhelpers/knex';

describe('INT: EmailConfirmationsStore', () => {
  const knex = getKnexConfig();
  const emailConfirmationsStore = new EmailConfirmationsStore(knex);

  it('get not existed emailConfirmation', async () => {
    await expect(emailConfirmationsStore.get('not-existed@unilogin.eth')).rejectedWith('Email confirmation not found for email: not-existed@unilogin.eth');
  });

  it('add emailConfirmation to database, get it from it and updateConfirmation status', async () => {
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
    const gottenEmailConfirmation = await emailConfirmationsStore.get(email);
    expect(gottenEmailConfirmation).be.deep.eq(emailConfirmation);

    await emailConfirmationsStore.updateIsConfirmed(gottenEmailConfirmation, true);
    expect(await emailConfirmationsStore.get(email)).to.deep.eq({...gottenEmailConfirmation, isConfirmed: true});
  });

  it('add two emailConfirmations to database and get the second one', async () => {
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

  afterEach(async () => {
    await knex('email_confirmations').del();
  });

  after(async () => {
    await knex.destroy();
  });
});
