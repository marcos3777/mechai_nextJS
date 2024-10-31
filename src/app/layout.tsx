// app/layout.tsx
import Cabecalho from "@/components/Cabecalho/Cabecalho";
import Rodape from "@/components/Rodape/Rodape";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Portifolio - FIAP",
  description: "Criado por alunos da FIAP para prova de FRONT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="flex flex-col min-h-screen">
        <Cabecalho />

        <main className="flex-grow">
          {children}
        </main>

        <Rodape />
      </body>
    </html>
  );
}
