function copy(id : string) {
  const content = document.getElementById(id) as HTMLInputElement;
  content.select();
  document.execCommand('copy');
}

export default copy;
