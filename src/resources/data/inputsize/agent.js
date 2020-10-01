const inputsize = {
  md: {
    // dados pessoais
    nome: 7,
    cpf: 4,
    nascimento: 5,
    celular: 8,
    email: 8,
    sexo: 8,
    rg_cnh: 8,

    // endereço
    cep: 4,
    estado: 3,
    bairro: 7,
    cidade: 9,
    endereco: 9,
    complemento: 6,
    numero_endereco: 3,
    comprovante_endereco: 7,
  },
  lg: {
    // dados pessoais
    nome: 6,
    cpf: 3,
    nascimento: 4,
    celular: 3,
    email: 6,
    sexo: 5,
    rg_cnh: 5,

    // endereço
    cep: 3,
    estado: 2,
    bairro: 5,
    cidade: 6,
    endereco: 5,
    complemento: 4,
    numero_endereco: 2,
    comprovante_endereco: 5,
  },
};

export default JSON.parse(JSON.stringify(inputsize));
