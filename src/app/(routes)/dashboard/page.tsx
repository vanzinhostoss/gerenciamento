"use client"
import { AuthContext } from "@/app/contexts/auth"
import Header from "@/components/Header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useContext, useEffect, useMemo, useState } from "react"
import { ToastContainer } from "react-toastify"

import { ClipboardCheck, ClipboardList, ClipboardPen, ShieldCheck, Sparkles, Timer } from "lucide-react"
import { OrdemContext } from "@/app/contexts/newOrdem"
import Chart from "@/components/chart"

const Dashboard = () => { 
    const[abertos, setAbertos] = useState(0)
    const[Finalizados, setFinalizados] = useState(0)

    const ordemCtx = useContext(OrdemContext)
    
      if (!ordemCtx) {
        return null // or some loading state
      }
    
      const { chamados } = ordemCtx
    
      const chartData = useMemo(() => {
        const aberto = chamados.filter((chamado) => chamado.status === "Aberto").length
        const finalizado = chamados.filter((chamado) => chamado.status === "Finalizado").length
        setAbertos(aberto)
        setFinalizados(finalizado)
        return[
          aberto,
          finalizado
        ]
      }, [chamados])
    
    return(
        <div className="mt-16 w-full max-w-[1540px] mx-auto px-3">
            <ToastContainer autoClose={3000} />
            <Header />
           

            <div className="my-6 flex flex-col px-3 items-center md:flex-row gap-6">
            <Card className="w-full bg-[#EFF6FF]">
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="font-sans text-gray-700">Total de OS</CardTitle>
                    <div><ClipboardList className="w-6 h-6 text-primary" /></div>
                </CardHeader>
                <CardContent>
                    <p className="text-blue-600 font-bold text-2xl">{ordemCtx?.chamados.length}</p>
                </CardContent>
            </Card>
            <Card className="w-full bg-[#F0FDF4]">
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="font-sans text-gray-700">OS em Aberto</CardTitle>
                    <div><ClipboardPen className="w-6 h-6 text-primary" /></div>
                </CardHeader>
                <CardContent>
                <p className="text-green-600 font-bold text-2xl">{abertos}</p>
                </CardContent>
            </Card>
            <Card className="w-full bg-[#FFF7ED]">
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="font-sans text-gray-700">OS Finalizadas</CardTitle>
                    <div><ClipboardCheck className="w-6 h-6 text-primary" /></div>
                </CardHeader>
                <CardContent>
                <p className="text-orange-700 font-bold text-2xl">{Finalizados}</p>
                </CardContent>
            </Card>
            </div>

              <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between px-6 py-6 border rounded-md">
          <div className="space-y-8 mb-10">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-primary">Bem-vindo ao Nosso Sistema </h1>
              <p className="text-muted-foreground text-lg">
                Simplifique seu processo de registro com nossa plataforma intuitiva
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Timer className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Processo Rápido</h3>
                  <p className="text-muted-foreground">Complete seu registro em menos de 2 minutos</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">100% Seguro</h3>
                  <p className="text-muted-foreground">Seus dados estão protegidos com a mais alta segurança</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Acompanhamento Completo</h3>
                  <p className="text-muted-foreground">Monitore atraves do gráfico</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Experiência Otimizada</h3>
                  <p className="text-muted-foreground">Interface moderna e fácil de usar</p>
                </div>
              </div>
            </div>
          </div>
       
          <Chart />
         
        </div>
              </div>
        {/* Welcome Message Section */}
       
      </div>
 
  )
}





export default Dashboard