import {keyAddedEvent, keyRemovedEvent, addedOwnerEvent} from '../../helpers/constants';
import {TEST_KEY} from '@unilogin/commons';
import {parseArgs, parseArgsGnosis} from '../../../src/core/utils/events';
import {expect} from 'chai';

describe('UNIT: parseArgs', () => {
  it('AddKey', () => {
    const result = parseArgs('KeyAdded', keyAddedEvent);
    expect(result.key).to.eq(TEST_KEY);
  });

  it('KeyRemoved', () => {
    const result = parseArgs('KeyRemoved', keyRemovedEvent);
    expect(result.key).to.eq(TEST_KEY);
  });
});

describe('UNIT: parseArgsGnosis', () => {
  it('AddedOwner', () => {
    const result = parseArgsGnosis('AddedOwner', addedOwnerEvent);
    expect(result.key).to.eq(TEST_KEY);
  });
});
