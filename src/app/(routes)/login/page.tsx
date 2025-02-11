"use client"
import { AuthContext } from "@/app/contexts/auth"
import Link from "next/link"
import { useContext, useState } from "react"
import { toast } from "react-toastify"

const Login = () => {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const authCtx = useContext(AuthContext)

    const handleLogin = async () => {
        if(email !== "" && senha !== ""){
            await authCtx?.signin(email, senha)
        }else{
            toast.error('Ops, preencha os campos')
        }
    }

    return(
        <div className=" bg-[#e0e0e0] h-screen w-full md:flex items-center justify-center">
          
            <div className="w-full max-w-[800px] h-[500px] flex ">
                <div className="hidden md:flex bg-[#4F67E8] p-6  flex-col gap-6 items-center justify-center rounded-tl-3xl">
                    <h2 className="text-center text-4xl font-bold text-white">Login</h2>
                    <p className="text-md text-gray-300 w-64 text-center">Digite Usúario e Senha para entrar no Sistema</p>
                    <p className="text-2xl font-bold text-white">Gestao <span className="text-3xl text-yellow-500">365</span></p>

                <div className="w-full h-2 bg-gradient-to-r from-lime-300 via-orange-300 via-pink-400 to-sky-300" />

                </div>
                <div className="p-6 flex flex-col h-screen md:h-auto items-center justify-center bg-white w-full">
                    <div className="md:hidden absolute top-20">
                        <p className="text-center text-gray-600 text-3xl font-bold ">Login</p>
                        <p className="text-center text-gray-600 my-3">Digite Usúario e Senha para entrar no Sistema</p>
                    </div>
                    <div className="flex flex-col justify-center w-full h-auto">
                    <label htmlFor="" className="text-gray-400 text-xs">EMAIL</label>
                    <input type="text" placeholder="Digite o seu email"
                    className="w-full border-b border-gray-300 outline-none text-gray-400 p-1 mb-10"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
                    <label htmlFor="" className="text-gray-400 text-xs ">SENHA</label>
                    <input type="password" placeholder="Digite a senha"
                    className="w-full border-b border-gray-300 outline-none text-gray-400 p-1 mb-10"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    />

                    <button className="bg-[#5271FF] py-2 px-3 w-full text-white rounded-sm"
                    onClick={handleLogin}
                    >
                    {authCtx?.loadingAuth ? "Carregando..." : 'Entrar'}
                    </button>

                    <Link href={"/register"}
                    className="text-gray-500 text-sm my-3 text-center"
                    >Ainda não possui uma conta? Crie ja a sua! </Link>
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default Login