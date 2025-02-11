
"use client"

import { OrdemContext } from "@/app/contexts/newOrdem"
import Header from "@/components/Header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { chamadosItem } from "@/types/chamadosItem"
import Link from "next/link"
import { useContext, useState, useMemo, useEffect } from "react"
import { FiEdit, FiPlus, FiTrash2, FiChevronLeft, FiChevronRight, FiLayers } from "react-icons/fi"
import Loading from "@/app/loading"
import { dataItem } from "@/types/data"
import { AuthContext } from "@/app/contexts/auth"
import ServiceModal from "@/components/Modal"
import { Eye } from "lucide-react"

const ITEMS_PER_PAGE = 5

const Cadastro = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ordemCtx = useContext(OrdemContext)

  const [filtroStatus, setFiltroStatus] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [dataDetail, setDataDetail] = useState<chamadosItem>()

  const handleEdit = async (item: chamadosItem) => {
    if (
      item.nome !== item.nome ||
      item.endereco !== item.endereco ||
      item.descricao !== item.descricao ||
      item.status !== item.status ||
      item.price !== item.price
    ) {
      await ordemCtx?.updateOrdem(item.id, item.nome, item.endereco, item.descricao, item.status, item.price)
    }
  }

  const handleDelete = async (item: chamadosItem) => {
    await ordemCtx?.deleteOrdem(item)
  }

  const filteredChamados = useMemo(() => {
    return (ordemCtx?.chamados || []).filter((item) => {
      const statusMatch = filtroStatus ? item.status === filtroStatus : true
      const searchMatch = item.nome.toLowerCase().includes(search.toLowerCase())
      return statusMatch && searchMatch
    })
  }, [ordemCtx?.chamados, filtroStatus, search])

  const totalPages = Math.max(1, Math.ceil(filteredChamados.length / ITEMS_PER_PAGE))

  const paginatedChamados = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredChamados.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredChamados, currentPage])

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleAddModal = (item:chamadosItem) => {
    setDataDetail(item)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [filtroStatus, search])

  if (ordemCtx?.loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="border border-gray-300 rounded-md w-full max-w-[1600px] mx-auto mt-16">
        <Header />
        <div className="border-b ">
        <p className="font-bold text-2xl p-3">Ordens de serviços</p>
        </div>
        <div className="mt-3 flex justify-between items-center flex-wrap px-3 w-full max-w-[1540px] mx-auto">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative">
              <input
                type="search"
                placeholder="Pesquise por cliente"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 pl-4 text-gray-500 rounded-md outline-none border border-gray-300 w-80 shadow-md"
              />
            </div>
            <button
              onClick={() => setFiltroStatus(null)}
              className={`${!filtroStatus ? "bg-blue-500 text-white" : "bg-[#F5F5F5] text-gray-600"} border rounded-md px-3 py-1 h-9 text-sm shadow-sm shadow-black/25 cursor-pointer transition duration-200 hover:bg-blue-600 hover:text-white`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroStatus("Aberto")}
              className={`${filtroStatus === "Aberto" ? "bg-green-500 text-white" : "bg-[#F5F5F5] text-green-600"} border rounded-md px-3 py-1 h-9 text-sm shadow-sm shadow-black/25 cursor-pointer transition duration-200 hover:bg-green-600 hover:text-white`}
            >
              Em Aberto
            </button>
            <button
              onClick={() => setFiltroStatus("Finalizado")}
              className={`${filtroStatus === "Finalizado" ? "bg-orange-500 text-white" : "bg-[#F5F5F5] text-orange-600"} border rounded-md px-3 py-1 h-9 text-sm shadow-sm shadow-black/25 cursor-pointer transition duration-200 hover:bg-orange-600 hover:text-white`}
            >
              Finalizadas
            </button>
          </div>
          <Link href={"/register-nova-ordem"}>
            <div className="bg-blue-500 rounded-md px-3 py-1 h-9 text-sm my-3 text-white flex items-center gap-5 cursor-pointer transition duration-200 hover:bg-blue-600">
              <span className="border rounded-full font-bold">
                <FiPlus />
              </span>{" "}
              Nova OS
            </div>
          </Link>
        </div>

        <Table className="w-full max-w-[1540px] mx-auto my-6">
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Cadastrado por</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-left">Data de Criação</TableHead>
              <TableHead className="text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedChamados.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="font-medium">{item.endereco}</TableCell>
                <TableCell className=" max-w-80">{item.descricao}</TableCell>
                <TableCell className=" max-w-80">{item.nomeUser?.split(" ")[0] } {item.nomeUser?.split(" ")[1]}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block rounded-md px-2 py-1 text-xs font-semibold ${
                      item.status === "Finalizado" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-left">R$ {item.price}</TableCell>
                <TableCell className="text-left">{item.created.toLocaleString()}</TableCell>
                <TableCell className="text-left">
                  <div className="flex gap-3">

                    <button className="shadow-md border h-8 w-8 rounded-md flex items-center justify-center transition duration-300 cursor-pointer hover:bg-gray-200"
                     onClick={() => {setIsModalOpen(true),handleAddModal(item)}}>
                      <Eye className="text-blue-500"/>
                    </button>
                    
                    <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={dataDetail}/>
                  
                    <Link href={`/register-nova-ordem?id=${item.id}`}>
                      <button
                        onClick={() => handleEdit(item)}
                        className="shadow-md border h-8 w-8 rounded-md flex items-center justify-center transition duration-300 cursor-pointer hover:bg-gray-200"
                      >
                        <FiEdit size={20} className="text-green-500" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(item)}
                      className="shadow-md border h-8 w-8 rounded-md flex items-center justify-center transition duration-300 cursor-pointer hover:bg-gray-200"
                    >
                      <FiTrash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Anterior
            </Button>
            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Próxima
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredChamados.length)}
                </span>{" "}
                a <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredChamados.length)}</span>{" "}
                de <span className="font-medium">{filteredChamados.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Anterior</span>
                  <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => goToPage(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Próxima</span>
                  <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cadastro

