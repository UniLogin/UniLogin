import fs from 'fs';

export const saveVariables = (filename : string, variables : Record<string, string>) => {
  const output = Object.entries(variables)
    .map(([key, value]) => `  ${key}='${value}'`)
    .join('\n');
  fs.writeFile(filename, output, (err) => {
    if (err) {
      return console.error(err);
    }
  });
};
