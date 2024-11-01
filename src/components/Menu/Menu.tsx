// componente/Menu.tsx

'use client';

import Image from "next/image";
import logofiap from "@/public/fiap.png";
import Link from "next/link";

interface MenuProps {
    currentPage: "login" | "inicio-meca" | "historico";
}

export default function Menu({ currentPage }: MenuProps) {
    const handleReload = () => {
        window.location.href = "/";
    };

    return (
        <div className="menu flex items-center p-4 ">
            <div onClick={handleReload} className="cursor-pointer">
                <Image src={logofiap} alt="Logo da Fiap" className="imgfiap w-16 h-16" />
            </div>
            <nav className="nav-menu flex space-x-4 ml-4">
                {currentPage === "login" && (
                    <Link href="/sobre" className="text-white hover:underline">
                        Sobre
                    </Link>
                )}
                {currentPage === "inicio-meca" && (
                    <>

                        <Link href="/inicio-meca/historico" className="text-white hover:underline">
                            Histórico
                        </Link>
                    </>
                )}
                {currentPage === "historico" && (
                    <Link href="/inicio-meca" className="text-white hover:underline">
                        Pedidos Finalizados
                    </Link>
                )}
            </nav>
        </div>
    );
}
