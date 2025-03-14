'use client'

import { MsdsRequestForm } from './MsdsRequestForm'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'


export const MsdsRequestButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90"
      >
        <span className="hidden md:inline">MSDS Talebi Oluştur</span>
        <span className="md:hidden">Yeni Talep</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>MSDS Talebi Oluştur</DialogTitle>
          </DialogHeader>
          
          <MsdsRequestForm onSuccess={() => setIsOpen(false)} />
          
        </DialogContent>
      </Dialog>
    </>
  )
}