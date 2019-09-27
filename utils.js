const snakeToCamelCase = str => str.replace(/-[a-z]/g, letter => letter.slice(1).toUpperCase());
const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).slice(1);
const lowerCaseFirstLetter = str => str[0].toLowerCase() + str.slice(1);

module.exports = { snakeToCamelCase, camelToSnakeCase, lowerCaseFirstLetter };
