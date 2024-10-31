import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { TipoProva } from "@/types/types";

const FILE_PATH = process.cwd() + '/src/data/base.json';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const file = await fs.readFile(FILE_PATH, 'utf-8');
    const data: TipoProva[] = JSON.parse(file);
    const prova = data.find(p => String(p.id) === params.id);

    if (prova) {
      return NextResponse.json(prova);
    } else {
      return NextResponse.json({ msg: "Prova não encontrada." }, { status: 404 });
    }
  } catch (error) {
    console.error('Erro ao buscar a prova:', error);
    return NextResponse.json({ msg: "Erro ao buscar a prova." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const file = await fs.readFile(FILE_PATH, 'utf-8');
    const provas: TipoProva[] = JSON.parse(file);

    const updatedData = await request.json();

    // Validar os dados recebidos
    if (!updatedData) {
      return NextResponse.json({ msg: "Dados inválidos." }, { status: 400 });
    }

    const indice = provas.findIndex(p => String(p.id) === params.id);

    if (indice !== -1) {
      const provaAtualizada = { ...provas[indice], ...updatedData };
      provaAtualizada.id = provas[indice].id; 

      provas[indice] = provaAtualizada;

      const fileUpdate = JSON.stringify(provas, null, 2);
      await fs.writeFile(FILE_PATH, fileUpdate);

      return NextResponse.json(provaAtualizada);
    } else {
      return NextResponse.json({ msg: "Prova não encontrada." }, { status: 404 });
    }
  } catch (error) {
    console.error('Erro ao atualizar a prova:', error);
    return NextResponse.json({ msg: "Erro ao atualizar a prova." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const file = await fs.readFile(FILE_PATH, 'utf-8');
    const provas: TipoProva[] = JSON.parse(file);

    const indice = provas.findIndex(p => String(p.id) === params.id);

    if (indice !== -1) {
      const [provaRemovida] = provas.splice(indice, 1);

      const fileUpdate = JSON.stringify(provas, null, 2);
      await fs.writeFile(FILE_PATH, fileUpdate);

      return NextResponse.json({ msg: "Prova excluída com sucesso.", prova: provaRemovida });
    } else {
      return NextResponse.json({ msg: "Prova não encontrada." }, { status: 404 });
    }
  } catch (error) {
    console.error('Erro ao excluir a prova:', error);
    return NextResponse.json({ msg: "Erro ao excluir a prova." }, { status: 500 });
  }
}
