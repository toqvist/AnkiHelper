import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FileContextType {
  selectedFile: string
  setSelectedFile: (fileName: string) => void
  result: string
  updateResult: (result: string) => void
  srcPreview: string[]
  resultPreview: string[]
  updateSrc: (fileName: string) => void
  updateResultPreview: (content: string) => void
  openSaveDialog: () => void
  resultToSource: (content: string) => Promise<void>
  inputToSource: (content: string) => Promise<void>
}

const FileContext = createContext<FileContextType | undefined>(undefined)

interface FileProviderProps {
  children: ReactNode
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<string>('')
  const [srcPreview, setSrcPreview] = useState<string[]>([])

  const [result, setResult] = useState<string>('')
  const [resultPreview, setResultPreview] = useState<string[]>([])

  const [processing, setProcessing] = useState<boolean>(false)

  async function updateSrc(filePath: string): Promise<void> {
    setSelectedFile(filePath)
    updateSrcPreview(filePath)
  }

  async function updateSrcPreview(filePath: string): Promise<void> {
    const filePreview = await window.api.previewFile(filePath)
    setSrcPreview(filePreview)
  }

  async function updateResult(content: string): Promise<void> {
    setResult(content)
    await updateResultPreview(content)
  }

  async function updateResultPreview(content: string): Promise<void> {
    const lines: string[] = content.split('\n')
    const linesToReturn: number = Math.min(10, lines.length)

    const result = lines.slice(0, linesToReturn)
    setResultPreview(result)
  }

  async function openSaveDialog(): Promise<void> {
    const filePath: string = await window.api.openSaveDialog()

    if (filePath && result) {
      window.api.saveFile(result, filePath)
    }
  }

  async function resultToSource(content: string): Promise<void> {
    const resultPath = await window.api.saveFileTemp(selectedFile, content)
    updateSrc(resultPath);
    updateResult("")
  }

  async function inputToSource(content: string): Promise<void> {
    const resultPath = await window.api.saveFileTemp('', content)
    updateSrc(resultPath);
  }

  return (
    <FileContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
        result,
        updateResult,
        srcPreview,
        resultPreview,
        updateSrc,
        updateResultPreview,
        openSaveDialog,
        resultToSource,
        inputToSource,
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

export const useFileContext = (): FileContextType => {
  const context = useContext(FileContext)
  if (!context) {
    throw new Error('useFileContext must be used within the FileProvider')
  }
  return context
}
