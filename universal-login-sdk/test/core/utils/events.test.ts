import {keyAddedEvent, keyRemovedEvent} from '../../helpers/constants';
import {TEST_KEY} from '@universal-login/commons';
import {parseArgs} from '../../../src/core/utils/events';
import {expect} from 'chai';

describe('parseArgs', () => {
  it('AddKey', async () => {
    const result = parseArgs('KeyAdded', keyAddedEvent);
    expect(result.key).to.eq(TEST_KEY);
  });

  it('KeyRemoved', async () => {
    const result = parseArgs('KeyRemoved', keyRemovedEvent);
    expect(result.key).to.eq(TEST_KEY);
  });
});
