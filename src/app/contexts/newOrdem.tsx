
"use client"

import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore"
import { createContext, type ReactNode, useEffect, useState } from "react"
import { db } from "../../firebaseConnection"
import { toast } from "react-toastify"
import type { dataItem } from "@/types/data"
import type { chamadosItem } from "@/types/chamadosItem"

type OrdemTypeContext = {
  handleAdd: (nome: string, endereco: string, descricao: string, status: string, price: string) => void
  status: string
  handleStatus: (value: string) => void
  loading: boolean
  chamados: chamadosItem[]
  deleteOrdem: (item: chamadosItem) => void
  updateOrdem: (id: string, nome: string, endereco: string, descricao: string, status: string, price: string) => void
  getOrdemById: (id: string) => chamadosItem | undefined
}

const listaRef = collection(db, "chamados")

export const OrdemContext = createContext<OrdemTypeContext | null>(null)

const OrdemProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState("")
  const [user, setUser] = useState<dataItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [chamados, setChamados] = useState<chamadosItem[]>([])
  const [lastDocs, setLastDocs] = useState<any>(null)

  useEffect(() => {
    const loadUser = () => {
      const detailUser = localStorage.getItem("@ticketsPRO")
      if (detailUser) {
        setUser(JSON.parse(detailUser))
      } else {
        setUser(null)
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    let unsubscribe: () => void

    const loadChamados = async () => {
      console.log("Iniciando carregamento de chamados")
      try {
        console.log("Configurando query do Firestore")
        const chamadosRef = collection(db, "chamados")
        const q = query(chamadosRef, orderBy("created", "desc"))

        console.log("Iniciando listener do Firestore")
        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            console.log("Snapshot recebido, processando dados")
            const lista: chamadosItem[] = []
            querySnapshot.forEach((doc) => {
              console.log("Processando documento:", doc.id)
              lista.push({
                id: doc.id,
                nome: doc.data().nome,
                endereco: doc.data().endereco,
                descricao: doc.data().descricao,
                status: doc.data().status,
                price: doc.data().price,
                created: doc.data().created.toDate(),
                userUid: doc.data().userUid,
                nomeUser:doc.data().nomeUser
              })
            })
            console.log("Total de chamados processados:", lista.length)
            setChamados(lista)
            setLoading(false)
            setLastDocs(querySnapshot.docs[querySnapshot.docs.length - 1])
          },
          (error) => {
            console.error("Erro ao buscar chamados:", error)
            setLoading(false)
            toast.error("Ops ocorreu um erro ao carregar os chamados.")
          },
        )
      } catch (error) {
        console.error("Erro ao configurar listener de chamados:", error)
        setLoading(false)
        toast.error("Erro ao configurar o carregamento dos chamados.")
      }
    }

    console.log("Chamando loadChamados")
    loadChamados()

    return () => {
      console.log("Limpando listener de chamados")
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const handleAdd = async (nome: string, endereco: string, descricao: string, status: string, price: string) => {
    setLoading(true)
    try {
      await addDoc(collection(db, "chamados"), {
        nome: nome,
        endereco: endereco,
        descricao: descricao,
        status: status,
        price: price,
        created: new Date(),
        userUid: user?.uid,
        nomeUser: user?.nome
      })
      toast.success("Ordem de serviço criada com sucesso!")
      setStatus(status)
    } catch (error) {
      console.log(error)
      toast.error("Erro ao registrar ordem de serviço")
    } finally {
      setLoading(false)
    }
  }

  const deleteOrdem = async (item: chamadosItem) => {
    if (!confirm(`Tem certeza que deseja excluir a O.S do cliente ${item.nome}?`)) return

    try {
      const docRef = doc(db, "chamados", item.id)
      await deleteDoc(docRef)
      toast.success("O.S excluída com sucesso.")
    } catch (error) {
      console.log(error)
      toast.error("Ops, ocorreu um erro ao excluir a O.S")
    }
  }

  const getOrdemById = (id: string) => {
    return chamados.find((chamado) => chamado.id === id)
  }

  const updateOrdem = async (id: string, nome: string, endereco: string, descricao: string, status: string, price: string) => {
    try {
      const docRef = doc(db, "chamados", id)
      await updateDoc(docRef, {
        nome: nome,
        endereco: endereco,
        descricao: descricao,
        status: status,
        price: price,
      })
      toast.success("O.S Atualizada.")
    } catch (error) {
      console.log(error)
      toast.error("Erro ao atualizar O.S")
    }
  }

  const handleStatus = () => {
    return status
  }

  return (
    <OrdemContext.Provider
      value={{ handleAdd, status, handleStatus, loading, chamados, deleteOrdem, updateOrdem, getOrdemById }}
    >
      {children}
    </OrdemContext.Provider>
  )
}

export default OrdemProvider

