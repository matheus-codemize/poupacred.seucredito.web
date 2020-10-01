const inputsize = {
  md: {
    // dados pessoais
    nome: 7,
    cpf: 4,
    nascimento: 5,
    celular: 4,
    email: 6,
    sexo: 6,
  },
  lg: {
    // dados pessoais
    nome: 6,
    cpf: 3,
    nascimento: 4,
    celular: 3,
    email: 8,
    sexo: 8,
  },
};

export default JSON.parse(JSON.stringify(inputsize));
