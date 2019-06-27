export function copy(id : string) {
  const content = document.getElementById(id);
  if (content instanceof HTMLInputElement) {
    content.select();
    document.execCommand('copy');
  } else {
    throw Error(`Element (#${id}) does not exist`);
  }
}
