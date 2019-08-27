import deepEqual = require('deep-equal');
import {ensure} from './errors';

export function *slices(array: number[], sliceSize: number) {
  for (let i = 0; i < array.length; i++) {
    if (i % sliceSize === 0) {
      yield array.slice(i, i + sliceSize);
    }
  }
}

export const shuffle = (array: number[]): number[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const array8bitTo16bit = (numbers: number[]) => {
  return Array.from(
    slices(numbers, 2),
    ([high, low]) => ((high << 8) | low & 0xFF) & 0xFFFF
  );
};

export const deepArrayStartWith = (array: any[], prefix: any[]) => {
  if (prefix.length > array.length) {
    return false;
  }
  const arrayPrefix = array.slice(0, prefix.length);
  return deepEqual(arrayPrefix, prefix);
};

export const getArrayElementsFromIndicies = <T>(array: T[], indices: number[]) => {
  indices.forEach((index) => ensure(0 <= index && index < array.length, Error, 'index out of bounds'));
  return indices.map((index) => array[index]);
};
