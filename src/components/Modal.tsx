"use client"

import { OrdemContext } from "@/app/contexts/newOrdem"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { chamadosItem } from "@/types/chamadosItem"
import { Calendar, MapPin, User } from "lucide-react"
import { useContext } from "react"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  data: chamadosItem | undefined
}

export default function ServiceModal({ isOpen, onClose, data }: ServiceModalProps) {

    
  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold border-b pb-2 text-gray-900">Detalhes do Serviço</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 ">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Nome</label>
            <p className="text-base font-semibold text-gray-900">{data?.nome}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço
            </label>
            <p className="text-base text-gray-900">{data?.endereco}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Descrição</label>
            <p className="text-base text-gray-900">{data?.descricao}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                Cadastrado por
              </label>
              <p className="text-base text-gray-900">{data?.nomeUser.split(" ")[0]} {data?.nomeUser.split(" ")[1]}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data de Criação
              </label>
              <p className="text-base bg-orange-100 text-orange-800  font-medium inline-block p-1 rounded-md">{data?.created.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[rgb(51,122,255)] text-white hover:bg-blue-600 hover:text-white"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

