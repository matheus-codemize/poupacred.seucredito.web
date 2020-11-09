const inputsize = {
  md: {
    // dados pessoais
    nome: 7,
    cpf: 4,
    nascimento: 5,
    celular: 8,
    email: 8,
    rg_cnh: 8,
    sexo: 8,

    // endereço
    cep: 4,
    estado: 5,
    bairro: 7,
    cidade: 7,
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
    rg_cnh: 5,
    sexo: 5,

    // endereço
    cep: 4,
    estado: 6,
    bairro: 6,
    cidade: 6,
    endereco: 6,
    complemento: 8,
    numero_endereco: 4,
    comprovante_endereco: 8,
  },
};

export default JSON.parse(JSON.stringify(inputsize));
