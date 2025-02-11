// 'use client'

// import { addDoc, collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
// import { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import { db } from "../services/firebaseConnection";
// import { toast } from "react-toastify";
// import { AuthContext } from "./auth";
// import { dataItem } from "@/types/data";
// import { chamadosItem } from "@/types/chamadosItem";
// import { error } from "console";


// type OrdemTypeContext = {
//     handleAdd: (nome: string, descricao: string, status: string, price: string) => void
//     status: string;
//     handleStatus: (value: string) => void;
//     loading: boolean,
//     chamados: chamadosItem[],
//     deleteOrdem: (item: chamadosItem) => void
//     updateOrdem: (id: string, nome: string, descricao: string, status: string, price: string) => void
//     getOrdemById: (id: string) => chamadosItem | undefined; // Nova função para buscar pelo ID
// }

// const listaRef = collection(db, "chamados")

// export const OrdemContext = createContext<OrdemTypeContext | null>(null)


// const OrdemProvider = ({children}: {children: ReactNode}) => {
    
//     const [status, setStatus] = useState('')
//     const [user, setUser] = useState<dataItem>()
//     const [loading, setLoading] = useState(false)
//     const [chamados, setChamados] = useState<chamadosItem[]>([])
//     const [lastDocs, setLastDocs] = useState(); // paginação
//     const [editChamado, setEditChamado] = useState<chamadosItem | null>(null)

//      //Pegando o usuario que esta logando para colocar na hora de registrar uma ordem de serviço
//      useEffect(() => {

//         const loadUSer = () => {

//             const detailUser = localStorage.getItem("@ticketsPRO")
           
//             if(detailUser){
//                 setUser(JSON.parse(detailUser))
//             }
            
//         }

//         loadUSer()
      
//      },[])

//      useEffect(() => {
//         const loadTarefas = async () => {
//             const userDetail = localStorage.getItem("@ticketsPRO");

//             if (userDetail) {
//                 const data = JSON.parse(userDetail);
//                 setUser(data);  // Atualiza o estado do usuário

//                 // Referência à coleção "chamados"
//                 const chamadosRef = collection(db, "chamados");

//                 // Consulta para filtrar os chamados do usuário logado
//                 const q = query(
//                     chamadosRef,
//                     where("userUid", "==", data?.uid),  // Filtro pelo userUid
//                     orderBy("created", "desc")  // Ordena pelos mais recentes
//                 );

//                 try {
//                     // Subscrição do Firestore para dados em tempo real
//                     const unSub = onSnapshot(q, (snapshot) => {
//                         let lista:chamadosItem[] = [];

//                         snapshot.forEach((doc) => {
//                             const createdTimestamp = doc.data().created;
//                             const createdDate = createdTimestamp.toDate();  // Convertendo o Timestamp para Date

//                             lista.push({
//                                 id: doc.id,
//                                 nome: doc.data().nome,
//                                 descricao: doc.data().descricao,
//                                 status: doc.data().status,
//                                 price: doc.data().price,
//                                 created: createdDate,
//                                 userUid: doc.data().userUid,
//                             });
//                         });

//                         setChamados(lista);  // Atualiza os chamados
//                         setLoading(false);  // Finaliza o carregamento
//                     });

//                     // Cleanup: cancelar a inscrição quando o componente for desmontado
//                     return () => unSub();
//                 } catch (err) {
//                     setLoading(false);
//                     toast.error("Erro ao carregar os chamados");  // Se ocorrer algum erro
//                 }
//             } else {
//                 setLoading(false);
//                 toast.error("Usuário não encontrado");
//             }
//         };

//         loadTarefas();  // Chama a função para carregar os chamados
//     }, []);  // Executa apenas uma vez, quando o componente for montado

    
//     useEffect(() => {

          
//         const loadChamados = () => {
//           const q = query(listaRef, orderBy("created", "desc"), limit(10))
    
//           const unsubscribe = onSnapshot(q, (querySnapshot) => {

//               updateState(querySnapshot)
//               setLoading(false)
//             },
//             (error) => {
//               console.error("Error fetching chamados: ", error)
//               setLoading(false)
//               toast.error("Ops ocorreu um erro.")
//             },
//           )
    
//           return unsubscribe
//         }
    
//         const unsubscribe = loadChamados()
//         return () => unsubscribe()
//       }, [])
    
//       const updateState = (querySnapshot:any) => {
//         const isCollectionEmpty = querySnapshot.size === 0
    
//         if (!isCollectionEmpty) {
//           const lista:chamadosItem[] = []
    
//           querySnapshot.forEach((doc: any) => {
//             const createdTimestamp = doc.data().created
//             const createdDate = createdTimestamp.toDate()
    
//             lista.push({
//               id: doc.id,
//               nome: doc.data().nome,
//               descricao: doc.data().descricao,
//               status: doc.data().status,
//               price: doc.data().price,
//               created: createdDate,
//               userUid: doc.data().userUid,
//             })
//           })
    
//           const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
//           setChamados(lista) // Replace existing chamados instead of appending
//           setLastDocs(lastDoc)
//         } else {
//           setChamados([])
//         }
//       }

//     const handleAdd = async (nome: string, descricao: string, status: string, price: string) => {
//         setLoading(true)

//         await addDoc(collection(db, "chamados"), {
//             nome: nome,
//             descricao: descricao,
//             status: status,
//             price: price,
//             created: new Date(),
//             userUid: user?.uid,
//           })
//           .then(() => {
//             toast.success("Ordem de serviço criada com sucesso!")
//             setLoading(false)
//             setStatus(status)
//           })
//           .catch((error) => {
//             console.log(error)
//             setLoading(false)
//             toast.error('Erro ao registrar ordem de serviço')
//           })

//     }

//     const deleteOrdem = async (item: chamadosItem) => {
        
//         if(!confirm(`Tem certeza que deseja excluir a O.S do cliente ${item.nome}?`)) return

//         const docRef = doc(db, "chamados", item.id)
//         await deleteDoc(docRef)
//         .then(() => {
//           toast.success("O.S excluido com sucesso.")
//         })
//         .catch((error)=> {
//           console.log(error)
//           toast.error("Ops, ocorreu um erro ao excluir a O.S")
//         })

//     }

//         // Função para buscar a ordem pelo ID
//     const getOrdemById = (id: string) => {
//     return chamados.find(chamado => chamado.id === id);
//     };
    
//     //-------EDITANDO TAREFA

//     const updateOrdem = async (id: string, nome: string, descricao: string, status: string, price: string) => {
//       try {
//           const docRef = doc(db, "chamados", id);
          
//           // Atualize o documento apenas se houver mudanças
//           await updateDoc(docRef, {
//               nome: nome,
//               descricao: descricao,
//               status: status,
//               price: price
//           });
  
//           toast.success("O.S Atualizada.");
//       } catch (error) {
//           console.log(error);
//           toast.error("Erro ao atualizar O.S");
//       }
//   };
  



//     const handleStatus = () => {
//         return status
//     }

//     return(
//         <OrdemContext.Provider value={{handleAdd, status, handleStatus, loading, chamados, deleteOrdem, updateOrdem, getOrdemById}}>
//             {children}
//         </OrdemContext.Provider>
//     )
// }

// export default OrdemProvider;

"use client"

import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore"
import { createContext, type ReactNode, useEffect, useState } from "react"
import { db } from "../services/firebaseConnection"
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

