'use client';

import Image from "next/image";
import logofiap from "@/public/fiap.png"

export default function Menu() {
    const handleReload = () => {
        window.location.href = "/";
    };
    return (
            <div onClick={handleReload}>
                <Image src={logofiap} alt="Logo da Fiap" className="imgfiap" />
            </div>
    )
}
