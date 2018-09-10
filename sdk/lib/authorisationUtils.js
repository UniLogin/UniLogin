const diffIndexAuthorisationsArray = (currentArray, newArray) =>   {
  const sortedIndexArray = getSortedIndexArray(newArray);
  const diff = sortedIndexArray.filter((element) => !currentArray.includes(element));
  return diff;
};

const getSortedIndexArray = (array) => 
  array
    .map((element) => element.index)
    .sort(compareNumbers);

const compareNumbers = (number1, number2) =>
  number1 - number2;

export {diffIndexAuthorisationsArray, getSortedIndexArray};
