// "use client"
// import { DollarSign } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import { ChartConfig, ChartContainer } from "./ui/chart"
// import { Bar, CartesianGrid, XAxis, BarChart } from "recharts"

// const Chart = () => {

//     const chartData = [
//         { month: "January", desktop: 186, mobile: 80 },
//         { month: "February", desktop: 305, mobile: 200 },
//       ]
        
//       const chartConfig = {
//         desktop: {
//           label: "Desktop",
//           color: "#2563eb",
//         },
//         mobile: {
//           label: "Mobile",
//           color: "#60a5fa",
//         },
//       } satisfies ChartConfig


//     return(
//         <Card className="w-full md:max-w-[800px]">
//             <CardHeader>
//                 <div className="flex items-center justify-center">
//                     <CardTitle className="text-lg sm:text-xl text-gray-600">
//                         Overview Ordens de Serviços
//                     </CardTitle>
//                     <DollarSign className="ml-auto w-4 h-4" />
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
//                     <BarChart data={chartData}>
//                         <CartesianGrid vertical={false} />
//                         <XAxis 
//                         dataKey="month"
//                         tickLine={false}
//                         tickMargin={10}
//                         axisLine={false}
//                         tickFormatter={(value) => value.slice(0, 3)}
//                         />

//                         <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
//                         <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
//                     </BarChart>
//                 </ChartContainer>
//             </CardContent>
//         </Card>
//     )
// }

// export default Chart

"use client"

import { useContext, useMemo } from "react"
import { ClipboardList, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip } from "./ui/chart"
import { Bar, CartesianGrid, XAxis, BarChart } from "recharts"
import { OrdemContext } from "@/app/contexts/newOrdem"

const Chart = () => {
  const ordemContex = useContext(OrdemContext)

  if (!ordemContex) {
    return null // or some loading state
  }

  const { chamados } = ordemContex

  const chartData = useMemo(() => {
    const aberto = chamados.filter((chamado) => chamado.status === "Aberto").length
    const finalizado = chamados.filter((chamado) => chamado.status === "Finalizado").length
    const total = chamados.length

    return [
      { status: "Aberto", quantidade: aberto },
      { status: "Finalizado", quantidade: finalizado },
      { status: "Total de O.S", quantidade: total },
    ]
  }, [chamados])

  const chartConfig = {
    Aberto: {
      label: "Aberto",
      color: "#FFF",
    },
    Finalizado: {
      label: "Finalizado",
      color: "hsl(var(--chart-2))",
    },
    Total: {
      label: "Total",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <Card className="w-full md:max-w-[800px]">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl text-gray-700">Overview Ordens de Serviços</CardTitle>
          <ClipboardList className="ml-auto w-6 h-6" />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip />
            <Bar dataKey="quantidade" fill="#3b82f6" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default Chart

