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
  
  export type Carro = {
    idCarro: number;
    idCliente: number;
    placa: string;
    marca: string;
    modelo: string;
    anoFabricacao: string;
    cor: string;
    status: number;
    imageUrl?: string;
  };

  export interface Orcamento {
    idOrcamento: number;
    idCliente: number; 
    idMecanico?: number | null;
    idCarro: number;
    valor: string;
    dtPrevistaFinalizacao: string;
    dtFinalizacao: string;
    tipoProblema: string;
    descricaoProblema: string;
    enderecoAtual: string;
    status: number;
  }

  export interface OrcamentoComDetalhes extends Orcamento {
    clienteNome: string;
    carroModelo: string;
  }

 