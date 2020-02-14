import {expect} from 'chai';
import {parseQuery} from '../../src/ui/utils/parseQuery';

describe('UNIT: parseQuery', () => {
  it('correctly parse encoded search', () => {
    let search = '?applicationInfo={%22applicationName%22:%22UniLogin%22,%22logo%22:%22http://host:123//favicon.png%22,%22type%22:%22laptop%22}&picker=false';
    expect(parseQuery(search)).deep.eq({
      applicationInfo: '{"applicationName":"UniLogin","logo":"http://host:123//favicon.png","type":"laptop"}',
      picker: 'false',
    });

    search = '?picker=false&applicationInfo={%22applicationName%22:%22UniLogin%22,%22logo%22:%22http://host:123//favicon.png%22,%22type%22:%22laptop%22}';
    expect(parseQuery(search)).deep.eq({
      applicationInfo: '{"applicationName":"UniLogin","logo":"http://host:123//favicon.png","type":"laptop"}',
      picker: 'false',
    });
  });

  it('correctly parse decoded search', () => {
    const search = '?applicationInfo={"applicationName":"UniLogin","logo":"http://host:123//favicon.png","type":"laptop"}&picker=false';
    expect(parseQuery(search)).deep.eq({
      applicationInfo: '{"applicationName":"UniLogin","logo":"http://host:123//favicon.png","type":"laptop"}',
      picker: 'false',
    });
  });
});
