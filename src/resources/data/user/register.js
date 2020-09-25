const data = {
  login: '',
  password: '',
};

const dataKeys = {
  login: 'login',
  password: 'senha',
};

export function convertKeys(data) {
  return Object.assign(
    {},
    ...Object.keys(data).map(key => ({ [dataKeys[key]]: data[key] })),
  );
}

export default JSON.parse(JSON.stringify(data));
