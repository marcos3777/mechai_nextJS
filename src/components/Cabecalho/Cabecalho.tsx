// componente/Cabecalho.tsx

'use client';

import Menu from "../Menu/Menu";
import { usePathname } from "next/navigation";

export default function Cabecalho() {
    const pathname = usePathname();

    // Define a página atual com base na rota
    let currentPage: "login" | "inicio-meca" | "historico";
    if (pathname === "/inicio-meca/historico") {
        currentPage = "historico";
    } else if (pathname === "/inicio-meca") {
        currentPage = "inicio-meca";
    } else {
        currentPage = "login";
    }

    return (
        <header className="cabecalho">
            <Menu currentPage={currentPage} />
        </header>
    );
}
