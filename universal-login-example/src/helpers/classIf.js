function classIf(predicate, fulfilledClass, otherClasses = '') {
  if (predicate) {
    return `${fulfilledClass} ${otherClasses}`;
  }
  return otherClasses;
}

export default classIf;

