"use client"

import { useState, useEffect, useContext, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation" // Updated import for App Router [^1]
import { OrdemContext } from "@/app/contexts/newOrdem" // Your context
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/Header"
import { toast } from "react-toastify"

const RegisterNovaOrdemForm = () => {
  const [nome, setNome] = useState("")
  const [endereco, setEndereco] = useState("")
  const [descricao, setDescricao] = useState("")
  const [status, setStatus] = useState("")
  const [price, setPrice] = useState("")

  const ordemCtx = useContext(OrdemContext)

  const router = useRouter()
  const searchParams = useSearchParams() // Use useSearchParams hook [^1]
  const id = searchParams.get("id") // Get id from search params [^1]

  useEffect(() => {
    if (id) {
      const loadOrdem = async () => {
        // Fetch the order with the ID
        const ordem = await ordemCtx?.getOrdemById(id)
        if (ordem) {
          setNome(ordem.nome)
          setEndereco(ordem.endereco)
          setDescricao(ordem.descricao)
          setStatus(ordem.status)
          setPrice(ordem.price)
        }
      }
      loadOrdem()
    }
  }, [id, ordemCtx])

  const handleChange = (event: string) => {
    setStatus(event)
  }

  const handleAddOrdem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (nome === "" && endereco === "" && descricao === "" && status === "" && price === "") {
      toast.error("Preecnha todos os campos")
    }
    
    if (nome !== "" && endereco !== "" && descricao !== "" && status !== "" && price !== "") {
      if (id) {
        // Se existe ID edite a Ordem
        await ordemCtx?.updateOrdem(id, nome, endereco, descricao, status, price)

      } else {
        // Se nao existe Id cria uma nova Ordem
        await ordemCtx?.handleAdd(nome, endereco, descricao, status, price)
      }

      setNome("")
      setDescricao("")
      setStatus("")
      setPrice("")
       // Redirect to a success page or the orders list
       router.push("/new-ordem")
    }
    
  }


    return (
        <div className="mt-16 w-full max-w-[1600px] mx-auto px-3">
            <Header />
            
            <div className="flex flex-col-reverse items-center gap-3 md:flex-row justify-evenly border p-2 md:p-6 rounded-md">
                <form onSubmit={handleAddOrdem} className="flex flex-col w-full max-w-[500px] border p-6">
                    <label htmlFor="">Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder="Digite o nome do cliente"
                        className="border w-full p-2 rounded-md outline-none text-gray-600 mb-3"
                    />
                    <label htmlFor="">Endereço Completo</label>
                    <input
                        type="text"
                        value={endereco}
                        onChange={e => setEndereco(e.target.value)}
                        placeholder="Ex: Rua Antonieta 88, Centro, Sergipe"
                        className="border w-full p-2 rounded-md outline-none text-gray-600 mb-3"
                    />
                    <label htmlFor="">Descrição</label>
                    <textarea 
                      value={descricao}
                      placeholder="Digite a descrição"
                      onChange={e => setDescricao(e.target.value)}
                    className="border w-full p-2 rounded-md outline-none text-gray-600 mb-3"/>
                    
                    <label htmlFor="">Preço</label>
                    <input
                        type="text"
                        value={price}
                        placeholder="R$: 19.90"
                        onChange={e => setPrice(e.target.value)}
                        className="border w-full p-2 rounded-md outline-none text-gray-600 mb-3"
                    />
                    <Select value={status} onValueChange={handleChange}>
                        <SelectTrigger className="w-full my-3">
                            <SelectValue placeholder="Selecione um Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem className="text-gray-500" value="Aberto">Aberto</SelectItem>
                                <SelectItem className="text-gray-500" value="Finalizado">Finalizado</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button className="w-full" type="submit">Salvar</Button>
                </form>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold my-2 px-3 text-center">Formulário de {id ? "Edição" : "Cadastro"}</h1>
                    <p className="font-bold text-lg max-w-96 text-center">
                        "Preencha as informações necessárias para {id ? "editar" : "registrar"} sua ordem."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterNovaOrdemForm;



