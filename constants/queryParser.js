module.exports = (string) =>
  //   string && string.startsWith('?')
  // ?
  string
    .slice(1)
    .split('&')
    .reduce((acc, curr) => {
      const [key, value = 'true'] = curr.split('=');

      if (!key) return acc;

      if (acc[key]) {
        if (typeof acc[key] === 'string') {
          acc[key] = [acc[key], value];
          return acc;
        }
        acc[key] = [...acc[key], value];
        return acc;
      }

      acc[key] = value;
      return acc;
    }, {});
// : '';
