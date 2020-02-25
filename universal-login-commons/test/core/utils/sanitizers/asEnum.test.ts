import {expect} from 'chai';
import {asEnum} from '../../../../src/core/utils/sanitizers/asEnum';
import {Result, Sanitizer} from '@restless/sanitizers';

describe('UNIT: asEnum', () => {
  it('enum with 2 strings', () => {
    const sanitizer: Sanitizer<'foo' | 'bar'> = asEnum(['foo', 'bar'], 'enum');
    expect(sanitizer('foo', '')).to.deep.eq(Result.ok('foo'));
    expect(sanitizer('bar', '')).to.deep.eq(Result.ok('bar'));
    expect(sanitizer('baz', '')).to.deep.eq(Result.error([{path: '', expected: 'enum'}]));
    expect(sanitizer(3, '')).to.deep.eq(Result.error([{path: '', expected: 'enum'}]));
  });

  it('enum with number + string', () => {
    const sanitizer: Sanitizer<'foo' | 23> = asEnum(['foo', 23], 'enum');
    expect(sanitizer('foo', '')).to.deep.eq(Result.ok('foo'));
    expect(sanitizer(23, '')).to.deep.eq(Result.ok(23));
    expect(sanitizer('baz', '')).to.deep.eq(Result.error([{path: '', expected: 'enum'}]));
    expect(sanitizer(3, '')).to.deep.eq(Result.error([{path: '', expected: 'enum'}]));
    expect(sanitizer(null, '')).to.deep.eq(Result.error([{path: '', expected: 'enum'}]));
  });
});
