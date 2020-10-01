const register = {
    /** dados pessoais */
    cpf: '',
    sexo: 1,
    nome: '',
    email: '',
    celular: '',
    nascimento: '',
    rg_cnh: null, // instanceof File

    /** endereço */
    cep: '',
    estado: '',
    bairro: '',
    cidade: '',
    endereco: '',
    complemento: '',
    numero_endereco: '',
    comprovante_endereco: null, // instanceof File

    /** certificação e currículo */
    certificacao: '',
    curriculo: null, // instanceof File
  };
  
  export default JSON.parse(JSON.stringify(register));
  