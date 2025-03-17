'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowUpDown, Eye, Download, FileText } from "lucide-react"
import useAuth from "@/hooks/use-auth" // Düzeltilmiş import
import { toast } from 'sonner'

// Tip tanımını koruyalım
type MsdsRequest = {
  id: string
  productName: string
  description: string
  status: 'pending' | 'inProgress' | 'completed' | 'processing'
  createdAt: string
  sdsFile?: {
    id: string;
    filename: string;
    url: string;
  };
}
export const MsdsRequestsList = () => {
  const [requests, setRequests] = useState<MsdsRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  
  // Arama ve filtreleme için state'ler
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortColumn, setSortColumn] = useState  ('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const fetchRequests = async () => {
    if (!user) return
  
    try {
      setIsLoading(true)
    
      // Doğrudan Payload API'sini kullanıyoruz - depth parametresi önemli
      const response = await fetch(`/api/msdsRequests?where[requestedBy][equals]=${user.id}&depth=2`, {
        credentials: 'include',
      })
      
  
      const responseText = await response.text()
      
      if (!response.ok) {
        throw new Error(`Talepler getirilemedi: ${response.status} ${responseText}`)
      }
  
      const data = JSON.parse(responseText)
      console.log('API response:', data.docs) // API yanıtını kontrol edelim
      setRequests(data.docs || [])
    } catch (error) {
      console.error('Error fetching MSDS requests:', error)
      toast.error('Talepler yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [user])

  // Status dönüşüm fonksiyonları
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede'
      case 'inProgress': 
      case 'processing': return 'İşleme Alındı'
      case 'completed': return 'Tamamlandı'
      default: return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'inProgress': 
      case 'processing': return 'default'
      case 'completed': return 'outline'
      case 'rejected': return 'destructive'
      default: return 'default'
    }
  }

  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  // Sıralama işlevi
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  
  // Filtreleme ve sıralama
  const filteredData = requests
    .filter(request => {
      // Arama filtresi
      const searchMatch = !searchTerm || 
        request.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      // Durum filtresi
      const statusMatch = statusFilter === 'all' || request.status === statusFilter

      return searchMatch && statusMatch
    })
    .sort((a, b) => {
      // Sıralama
      if (sortColumn === 'productName') {
        return sortDirection === 'asc' 
          ? a.productName.localeCompare(b.productName)
          : b.productName.localeCompare(a.productName)
      }
      
      if (sortColumn === 'createdAt') {
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      
      if (sortColumn === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      }
      
      return 0
    })

  return (
    <Card className="p-6">
      {/* Arama ve filtre kısmı */}
      <div className="flex justify-between items-center py-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Ara: Ürün adı, açıklama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 py-2"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="inProgress">İşleme Alındı</option>
            <option value="completed">Tamamlandı</option>
          </select>
        </div>
      </div>
    
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>
        <Button
          variant="ghost"
          onClick={() => handleSort('productName')}
          className="font-medium justify-start px-0"
        >
          Ürün Adı
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead>
        <Button
          variant="ghost"
          onClick={() => handleSort('createdAt')}
          className="font-medium justify-start px-0"
        >
          Tarih
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead>
        <Button
          variant="ghost"
          onClick={() => handleSort('status')}
          className="font-medium justify-start px-0"
        >
          Durum
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead>Açıklama</TableHead>
      <TableHead className="text-right">İşlemler</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {isLoading ? (
      <TableRow>
        <TableCell colSpan={5} className="h-24 text-center"> {/* colSpan 4'ten 5'e çıkardık */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
          </div>
        </TableCell>
      </TableRow>
    ) : filteredData.length === 0 ? (
      <TableRow>
        <TableCell colSpan={5} className="h-24 text-center"> {/* colSpan 4'ten 5'e çıkardık */}
          Sonuç bulunamadı
        </TableCell>
      </TableRow>
    ) : (
      filteredData.map((request) => (
        <TableRow key={request.id}>
       <TableCell className="font-medium">
  <div className="flex items-center">
    {request.productName}
    {request.sdsFile && (
      <span className="inline-flex ml-2" title="Dosya eklenmiş">
        <FileText className="h-4 w-4 text-gray-400" />
      </span>
    )}
  </div>
</TableCell>
          <TableCell>{formatDate(request.createdAt)}</TableCell>
          <TableCell>
            <Badge variant={getStatusVariant(request.status)}>
              {getStatusText(request.status)}
            </Badge>
          </TableCell>
          <TableCell className="max-w-xs truncate">{request.description}</TableCell>
          <TableCell className="text-right">
  {request.sdsFile ? (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          // Önce dosya bilgilerini kontrol edelim
          console.log('Tam dosya bilgileri:', {
            file: request.sdsFile,
            url: request.sdsFile?.url,
            filename: request.sdsFile?.filename
          });

          if (!request.sdsFile?.filename) {
            toast.error('Dosya adı bulunamadı');
            return;
          }

          // Payload'un verdiği URL'yi kullan
          const fileUrl = request.sdsFile.url;
          
          if (!fileUrl) {
            toast.error('Dosya URL\'si bulunamadı');
            return;
          }

          console.log('İndirme deneniyor:', fileUrl);

          const response = await fetch(fileUrl, {
            method: 'GET',
            credentials: 'include'
          });

          if (!response.ok) {
            console.error('İndirme başarısız:', {
              status: response.status,
              statusText: response.statusText,
              url: fileUrl,
              headers: Object.fromEntries(response.headers.entries())
            });
            throw new Error(`İndirme başarısız: ${response.status}`);
          }

          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = request.sdsFile.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          window.URL.revokeObjectURL(downloadUrl);
          toast.success('Dosya indiriliyor...');
        } catch (error) {
          console.error('İndirme hatası:', error);
          toast.error('Dosya indirilemedi');
        }
      }}
    >
      <Download className="h-4 w-4 mr-1" /> İndir
    </Button>
  ) : null}
</TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
    </Card>
  )
}