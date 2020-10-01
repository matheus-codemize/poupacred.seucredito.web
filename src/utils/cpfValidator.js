import { cpf as validator } from 'cpf-cnpj-validator';

export default function (cpf) {
    return validator.isValid(cpf)
}