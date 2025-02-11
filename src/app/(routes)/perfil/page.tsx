"use client"

import { useContext, useMemo, useState } from "react"
import { User, Mail, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthContext } from "@/app/contexts/auth"
import Header from "@/components/Header"
import { OrdemContext } from "@/app/contexts/newOrdem"


export default function ProfilePage() {

  const[abertos, setAbertos] = useState(0)
  const[Finalizados, setFinalizados] = useState(0)

  const authContext = useContext(AuthContext)

   const ordemContex = useContext(OrdemContext)
  
    if (!ordemContex) {
      return null // or some loading state
    }
  
    const { chamados } = ordemContex
  
    const chartData = useMemo(() => {
      const aberto = chamados.filter((chamado) => chamado.status === "Aberto").length
      const finalizado = chamados.filter((chamado) => chamado.status === "Finalizado").length
      const total = chamados.length
      setAbertos(aberto)
      setFinalizados(finalizado)
  
      return [
        aberto, finalizado, total
      ]
    }, [chamados])

  if (!authContext) {
    return null
  }

  const { user } = authContext

  return (
    <div className="px-3">
        <Header />

      <div className="container mx-auto px-4 py-3 shadow-md border mt-16 rounded-md">
       <div className="max-w-3xl mx-auto">
         <h1 className="text-2xl font-bold text-gray-700 mb-6">Perfil do Usuário</h1>

         <div className="grid gap-6">
          {/* Profile Card */}
          <Card className="overflow-hidden">
            <div className="h-24 bg-[#4285F4]" />
            <div className="relative">
              <div className="absolute -top-12 left-6">
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <User className="w-16 h-16 text-[#4285F4]" />
                </div>
              </div>
            </div>
            <CardContent className="pt-16 pb-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 cursor-not-allowed">{user?.nome || "Nome do Usuário"}</h2>
                  <p className="text-gray-500">{user?.profissao}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-[#4285F4]" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium cursor-not-allowed">{user?.email || "email@exemplo.com"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#4285F4]">{Finalizados}</p>
                  <p className="text-sm text-gray-500">Ordens Finalizadas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#4285F4]">{abertos}</p>
                  <p className="text-sm text-gray-500">Em Aberto</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#4285F4]">{chamados.length}</p>
                  <p className="text-sm text-gray-500">Total de Ordens</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
    </div>
  )
}

