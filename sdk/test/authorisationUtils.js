import {diffIndexAuthorisationsArray, getSortedIndexArray} from '../lib/authorisationUtils';
import chai from 'chai';
const {expect} = chai;

describe('Authorisation utils', () => {
  const array = [{key: '11333', index: 100}, {key:'16543', index: 19}, {key:'13', index: 5}];
  const array1 = [1,2,3];
  const array2 = [{key: '11333', index: 100}, {key:'16543', index: 19}, {key:'13', index: 1}, {key:'16543', index: 2}, {key:'13', index: 3}];
  const nullArray = [];

  it('should return array of indexes', async () => {
    expect(getSortedIndexArray(array)).to.deep.include(100, 19);
  });
  
  it('should return diff array', async () => {
    expect(diffIndexAuthorisationsArray(array1, array2)).to.deep.eq([19, 100]);
  });

  it('new array doesn`t contain all indexes of old array', async () => {
    const array3 = [{key: '11333', index: 100}, {key:'16543', index: 19}, {key:'13', index: 5}, {key:'16543', index: 2}, {key:'13', index: 3}];
    expect(diffIndexAuthorisationsArray(array1, array3)).to.deep.eq([5,19,100]);
  });

  it('first array is null', async () => {
    expect(diffIndexAuthorisationsArray(nullArray, array2)).to.deep.eq(getSortedIndexArray(array2));
  });

  it('second array is null', async () => {
    expect(diffIndexAuthorisationsArray(array1, nullArray)).to.deep.eq([]);
  });

  it('both arrays are null', async () => {
    expect(diffIndexAuthorisationsArray(nullArray, nullArray)).to.deep.eq([]);
  });

  it('similar arrays', async () => {
    const array2 = [{key:'13', index: 1}, {key:'16543', index: 2}, {key:'13', index: 3}];
    expect(diffIndexAuthorisationsArray(array1, array2)).to.deep.eq([]);
  });
});
