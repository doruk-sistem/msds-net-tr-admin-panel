'use client'

import { MsdsRequestForm } from './MsdsRequestForm'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'


export const MsdsRequestButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations()

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90"
      >
        <span className="hidden md:inline">{t('dashboardPage.msdsRequestButton.title')}</span>
        <span className="md:hidden">{t('dashboardPage.msdsRequestButton.newRequest')}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('dashboardPage.msdsRequestButton.dialogTitle')}</DialogTitle>
          </DialogHeader>
          
          <MsdsRequestForm onSuccess={() => setIsOpen(false)} />
          
        </DialogContent>
      </Dialog>
    </>
  )
}