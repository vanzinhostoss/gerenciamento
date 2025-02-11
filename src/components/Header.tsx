"use client"
import { AuthContext } from "@/app/contexts/auth"
import { UserRoundCheck } from "lucide-react"
import Link from "next/link"
import { useContext } from "react"

const Header = () => {

    const authCtxs = useContext(AuthContext)

    const handleLogout = async () => {
        await authCtxs?.logout();
    }

    return(
        <div  className="bg-blue-500 w-full py-3 md:px-3 shadow-md fixed left-0 top-0 right-0 mb-40">
            <div className="w-full max-w-[1540px] mx-auto flex items-center justify-between px-6">
            <nav>
                <ul className="flex items-center gap-6">
                    <Link className="text-white text-xs md:text-lg font-medium" href={'/dashboard'}>Dashboard</Link>
                    <Link className="text-white text-xs md:text-lg font-medium" href={'/new-ordem'}>Ordem Serviço</Link>         
                    <Link className="text-white text-xs md:text-lg  font-medium" href={'/perfil'}>Perfil</Link>         
                </ul>
            </nav>
            <div className="text-white font-bold md:flex items-center gap-2 text-md">
            <Link href={"/perfil"}>
                <div className="hidden md:flex items-center gap-2 justify-center">
                <UserRoundCheck />
                { authCtxs?.user?.nome.split(' ')[0]}
                </div>
            </Link>
                <span className="cursor-pointer text-white font-bold block" onClick={handleLogout}>(Sair)</span>
            </div>
            </div>
        </div>
    )
}

export default Header