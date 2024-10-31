import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { TipoProva } from "@/types/types";

export async function GET() {

    const file = await fs.readFile(process.cwd() + '/src/data/base.json','utf-8');
    const data = JSON.parse(file);
    return NextResponse.json(data);
}

export async function POST(request:Request) {

    const file = await fs.readFile(process.cwd() + '/src/data/base.json','utf-8');
    const provas:TipoProva[] = JSON.parse(file);

    //Realizar o destructuring no objeto request.
    // const{id, nome} = await request.json();
    const prova:TipoProva = await request.json();
    console.log("PROVA : " , prova);

    const novoId = provas[ provas.length -1].id + 1

    prova.id = novoId;

    provas.push(prova);

    const fileUpdate =  JSON.stringify(provas);

    await fs.writeFile(process.cwd() + '/src/data/base.json',fileUpdate);

    return NextResponse.json(prova,{status:201});
}