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

  describe('countConfirmed', () => {
    const email = 'user@email.com';
    const ensName = 'user.unilogin.eth';

    const emailConfirmation: EmailConfirmation = {
      email,
      ensName,
      code: '1234',
      isConfirmed: true,
      createdAt: new Date(),
    };

    it('0 confirmed', async () => {
      await emailConfirmationsStore.add({...emailConfirmation, isConfirmed: false});
      expect(await emailConfirmationsStore.countConfirmed(email, ensName)).eq(0);
    });

    describe('1 confirmed', () => {
      it('by ensName', async () => {
        await emailConfirmationsStore.add({...emailConfirmation, isConfirmed: false});
        await emailConfirmationsStore.add(emailConfirmation);
        expect(await emailConfirmationsStore.countConfirmed(email, 'not-existing.unilogin.eth')).eq(1);
      });

      it('by email', async () => {
        await emailConfirmationsStore.add({...emailConfirmation, isConfirmed: false});
        await emailConfirmationsStore.add(emailConfirmation);
        expect(await emailConfirmationsStore.countConfirmed('not@existing.mail', ensName)).eq(1);
      });
    });

    it('2 confirmed', async () => {
      await emailConfirmationsStore.add(emailConfirmation);
      await emailConfirmationsStore.add(emailConfirmation);
      expect(await emailConfirmationsStore.countConfirmed(email, ensName)).eq(2);
    });
  });

  afterEach(async () => {
    await knex('email_confirmations').del();
  });

  after(async () => {
    await knex.destroy();
  });
});
