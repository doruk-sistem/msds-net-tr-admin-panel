'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

import authService from '@/services/auth.service'
import { useToast } from '@/hooks/use-toast'

interface CompanySelectionModalProps {
    isOpen: boolean
    onClose: () => void
    userCompanies: Array<{
        id: string
        fullname: string
        email: string
        company: {
            id: string
            companyName: string
        }
        registrationCompleted: boolean
    }>
    email: string
}

export default function CompanySelectionModal({
    isOpen,
    onClose,
    userCompanies,
    email,
}: CompanySelectionModalProps) {
    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const t = useTranslations('companySelection')

    const handleCompanySelection = async () => {
        if (!selectedUserId) {
            toast({
                title: t('error.title'),
                description: t('error.selectCompany'),
            })
            return
        }

        setIsLoading(true)

        try {
            const res = await authService.selectCompany({
                email,
                userId: selectedUserId,
            })

            if (res?.accessToken) {
                toast({
                    title: t('successToast.title'),
                    description: t('successToast.description'),
                })
                router.push('/dashboard')
                onClose()
            }
        } catch (error: any) {
            console.error('Company selection error:', error)

            if (axios.isAxiosError(error)) {
                toast({
                    title: t('error.title'),
                    description: error?.response?.data?.error?.message || t('error.general'),
                })
            } else {
                toast({
                    title: t('error.title'),
                    description: t('error.general'),
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {t('description')}
                    </p>

                    <div className="space-y-3">
                        {userCompanies.map((userCompany) => (
                            <Card
                                key={userCompany.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${selectedUserId === userCompany.id
                                    ? 'ring-2 ring-primary border-primary'
                                    : 'hover:border-primary/50'
                                    }`}
                                onClick={() => setSelectedUserId(userCompany.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{userCompany.company.companyName}</h3>
                                            <p className="text-sm text-muted-foreground">{userCompany.fullname}</p>
                                        </div>
                                        {selectedUserId === userCompany.id && (
                                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {t('buttons.cancel')}
                        </Button>
                        <Button
                            onClick={handleCompanySelection}
                            className="flex-1"
                            loading={isLoading}
                            disabled={!selectedUserId}
                        >
                            {t('buttons.continue')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 