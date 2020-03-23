import {expect} from 'chai';
import {parseQuery} from '../../../src/core/utils/parseQuery';

describe('UNIT: parseQuery', () => {
  it('parses queries without ? in front', () => {
    expect(parseQuery('foo=bar')).to.deep.eq({
      foo: 'bar',
    });
  });

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

  it('correctly parses empty arguments', () => {
    const search = '?foo=&bar=false';
    expect(parseQuery(search)).deep.eq({
      foo: '',
      bar: 'false',
    });
  });

  it('parses values with special characters', () => {
    expect(parseQuery('?foo=a%3Db%3Fc%26d&bar=a%3Db%3Fc%26d')).to.deep.eq({
      foo: 'a=b?c&d',
      bar: 'a=b?c&d',
    });
  });
});
