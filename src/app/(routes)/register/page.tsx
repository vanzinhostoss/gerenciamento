"use client"
import { AuthContext } from "@/app/contexts/auth"
import Link from "next/link"
import { useContext, useState } from "react"
import { toast } from "react-toastify"

const Register = () => {

    const [nome, setNome] = useState('')
    const [profissao, setProfissao] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const authCtx = useContext(AuthContext)

    const handleRegister = async () => {
        if(nome !== "" && email !== "" && senha !== "" ){
           await authCtx?.signUp(nome, profissao, email, senha )
        }else{
            toast.error('Ops, Preencha os campos')
        }

        setNome("")
        setEmail("")
        setSenha("")
    }

    return(
        <div className=" bg-[#e0e0e0] h-screen w-full md:flex items-center justify-center">
          
            <div className="w-full max-w-[800px] h-[500px] flex ">
                <div className="hidden md:flex bg-[#4F67E8] p-6  flex-col gap-6 items-center justify-center rounded-tl-3xl">
                    <h2 className="text-center text-4xl font-bold text-white">Registre-se</h2>
                    <p className="text-md text-gray-300 w-64 text-center">Digite nome, usúario e senha para criar sua conta</p>
                    <p className="text-2xl font-bold text-white">Gestao <span className="text-3xl text-yellow-500">365</span></p>

                <div className="w-full h-2 bg-gradient-to-r from-lime-300 via-orange-300 via-pink-400 to-sky-300" />

                </div>
                <div className="p-6 flex flex-col h-screen md:h-auto items-center justify-center bg-white w-full">

                    <div className="md:hidden absolute top-4">
                        <p className="text-center text-gray-600 text-3xl font-bold ">Cadastre-se</p>
                        <p className="text-center text-gray-600 mb-5 mt-2 px-3">Digite nome, profissão, usúario e senha para criar sua conta</p>
                    </div>

                    <div className="flex flex-col justify-center w-full h-auto mt-5">
                    <label htmlFor="" className="text-gray-400 text-xs">NOME</label>
                    <input type="text" placeholder="Digite seu nome e sobrenome"
                    className="w-full border-b border-gray-300 outline-none text-gray-400 p-1 mb-10"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    />
                    <label htmlFor="" className="text-gray-400 text-xs">Profissão</label>
                    <input type="text" placeholder="Digite sua profissão"
                    className="w-full border-b border-gray-300 outline-none text-gray-400 p-1 mb-10"
                    value={profissao}
                    onChange={e => setProfissao(e.target.value)}
                    />
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
                    onClick={handleRegister}
                    >
                      {authCtx?.loadingAuth ? "Cadastrando..." : "Cadastrar"}  
                    </button>

                    <Link href={"/login"}
                    className="text-gray-500 text-sm my-3 text-center"
                    >Já possui uma conta? Faça login! </Link>
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default Register