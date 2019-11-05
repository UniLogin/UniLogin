export function calculateScrollProgress(
  ref: React.RefObject<HTMLDivElement>,
  callback: (progress: number) => void,
): void {
  if (ref.current === null) {
    callback(0.0);
    return;
  }
  const {scrollLeft, scrollWidth, clientWidth} = ref.current;
  const maxScrollLeft = scrollWidth - clientWidth;
  if (maxScrollLeft <= 0) {
    callback(1.0);
  } else {
    callback(scrollLeft / maxScrollLeft);
  }
}
