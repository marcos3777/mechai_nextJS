import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { TipoProva } from "@/types/types";

const FILE_PATH = process.cwd() + '/src/data/base.json';

export async function POST(request: Request) {
  try {
    const file = await fs.readFile(FILE_PATH, 'utf-8');
    const provas: TipoProva[] = JSON.parse(file);

    const novaProva: TipoProva = await request.json();

    // Validar os dados recebidos
    if (!novaProva || !novaProva.name || !novaProva.tipo || !novaProva.materia || !novaProva.semestre) {
      return NextResponse.json({ msg: "Dados inválidos. Todos os campos são obrigatórios." }, { status: 400 });
    }

    const { name, tipo, materia, semestre } = novaProva;

    // Filtrar provas do mesmo aluno, tipo, matéria e semestre
    const provasFiltradas = provas.filter(
      (prova) =>
        prova.name === name &&
        prova.materia === materia &&
        prova.semestre === semestre &&
        prova.tipo === tipo
    );

    // Lógica de verificação das restrições
    let maxProvasPermitidas = 0;

    if (tipo === 'checkpoint') {
      maxProvasPermitidas = 3;
    } else if (tipo === 'sprint') {
      maxProvasPermitidas = 2;
    } else if (tipo === 'globalsolution') {
      maxProvasPermitidas = 1;
    } else {
      return NextResponse.json({ msg: 'Tipo de prova inválido.' }, { status: 400 });
    }

    if (provasFiltradas.length >= maxProvasPermitidas) {
      return NextResponse.json(
        { msg: `Número máximo de provas do tipo ${tipo} para essa matéria e semestre já alcançado.` },
        { status: 400 }
      );
    }

    // Gerar um novo ID
    const novoId = provas.length > 0 ? Math.max(...provas.map(p => p.id)) + 1 : 1;
    novaProva.id = novoId;

    // Adicionar a nova prova aos dados existentes
    provas.push(novaProva);

    // Escrever os dados atualizados de volta no arquivo base.json
    await fs.writeFile(FILE_PATH, JSON.stringify(provas, null, 2), 'utf-8');

    return NextResponse.json(novaProva, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar a prova:', error);
    return NextResponse.json({ msg: "Erro ao cadastrar a prova." }, { status: 500 });
  }
}
