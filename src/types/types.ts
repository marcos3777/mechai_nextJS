// types.ts

// Tipo para a tabela TB_MECHAI_CLIENTE
export type Cliente = {
    idCliente: number;
    cpf: string;
    nome: string;
    endereco: string;
    email: string;
    telefone: string;
    loginCliente: string;
  };
  
  // Tipo para a tabela TB_MECHAI_MECANICO
  export type Mecanico = {
    idMecanico: number;
    cpf: string;
    nome: string;
    nmEmpresa: string;
    endereco: string;
    telefone: string;
    email: string;
  };
  
  // Tipo para a tabela TB_MECHAI_USUARIO
  export type Usuario = {
    idUsuario: number;
    idCliente: number;
    login: string;
    senhaHash: string;
    tipoUsuario: string;
  };
  