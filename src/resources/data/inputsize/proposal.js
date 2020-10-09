const inputsize = {
  md: {
    status: 6,
    proposta: 5,
    cpf: 5,
    nome: 6,
    periodo: 5,
    banco: 5,
    convenio: 8,
    produto: 8,
  },
  lg: {
    status: 6,
    proposta: 5,
    cpf: 5,
    nome: 6,
    periodo: 5,
    banco: 5,
    convenio: 8,
    produto: 8,
  },
};

export default JSON.parse(JSON.stringify(inputsize));
