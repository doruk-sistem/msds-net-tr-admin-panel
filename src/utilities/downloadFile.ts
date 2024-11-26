'use client'

interface Params {
  fileURL: string
  /**
   * example: `example.txt`
   */
  fileName: string
}

export default function downloadFile({ fileURL, fileName }: Params) {
  if (typeof fileURL !== 'string') {
    return
  }

  const downloadLink = document.createElement('a')
  downloadLink.href = fileURL
  downloadLink.download = fileName
  document.body.appendChild(downloadLink)
  downloadLink.click()
  URL.revokeObjectURL(fileURL)
}
