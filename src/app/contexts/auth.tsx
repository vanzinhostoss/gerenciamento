"use client"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { createContext, type ReactNode, useEffect, useState } from "react"
import { auth, db } from "../../firebaseConnection"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { dataItem } from "@/types/data"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

type authTypeContext = {
  user: dataItem | null
  signin: (email: string, senha: string) => void
  signUp: (nome: string, profissao: string, email: string, senha: string) => void
  loadingAuth: boolean
  logout: () => void
}

export const AuthContext = createContext<authTypeContext | null>(null)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [user, setUser] = useState<dataItem | null>(null)

  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("@ticketsPRO")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const signin = async (email: string, senha: string) => {
    setLoadingAuth(true)

    await signInWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        const uid = value.user.uid

        // Get the Firebase ID token
        const token = await value.user.getIdToken()

        // Set the token in a cookie that expires in 7 days
        document.cookie = `firebase_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`

        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)

        const data = {
          uid: uid,
          nome: docSnap.data()?.nome,
          profissao: docSnap.data()?.profissao,
          email: value.user.email,
        }
       
        setUser(data)
        storageUSer(data)
        setLoadingAuth(false)
        toast.success("Bem vindo de volta")
        router.push("/dashboard")
      })
      .catch((error) => {
        toast.error("Ops, verifique seu email e senha")
        console.log(`Error ao fazer login ${error}`)
        setLoadingAuth(false)
      })
  }

  const signUp = async (nome: string, profissao: string, email: string, senha: string) => {
    setLoadingAuth(true)

    await createUserWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        const uid = value.user.uid

        const token = await value.user.getIdToken()

        // Set the token in a cookie that expires in 7 days
        document.cookie = `firebase_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`

        await setDoc(doc(db, "users", uid), {
          nome: nome,
          profissao: profissao
        })
          .then(() => {
            const data = {
              uid: uid,
              nome: nome,
              profissao: profissao,
              email: value.user.email,
            }

            setUser(data)
            storageUSer(data)
            setLoadingAuth(false)
            toast.success("Cadastro feito com sucesso!")
            router.push("/dashboard")
          })
          .catch((error) => {
            console.log(`Ops algo deu errado. ${error}`)
            setLoadingAuth(false)
          })
      })
      .catch((error) => {
        toast.error("Ops, Erro ao fazer cadastro")
        console.log(`Error ao cadastrar ${error}`)
        setLoadingAuth(false)
      })
  }

  const storageUSer = (data: dataItem) => {
    localStorage.setItem("@ticketsPRO", JSON.stringify(data))
  }

  const logout = async () => {
    if(!confirm("Tem certeza que deseja sair?")) return;
    
    await signOut(auth)
    localStorage.removeItem("@ticketsPRO")
    // Remove the Firebase token cookie
    document.cookie = "firebase_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, signin, signUp, loadingAuth, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider

