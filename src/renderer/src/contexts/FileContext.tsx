import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FileContextType {
  resetFile: () => void,
  selectedFile: File
  setSelectedFile: (fileName: File) => void
  result: string
  updateResult: (result: string) => void
  srcPreview: string[]
  resultPreview: string[]
  updateSrc: (file: File) => void
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
  const defaultFile = new File([], '', { type: 'text/plain' });
  const [selectedFile, setSelectedFile] = useState<File>(defaultFile)
  const [srcPreview, setSrcPreview] = useState<string[]>([])

  const [result, setResult] = useState<string>('')
  const [resultPreview, setResultPreview] = useState<string[]>([])

  const [processing, setProcessing] = useState<boolean>(false)

  function resetFile() {
    setSelectedFile(defaultFile);
  };

  async function updateSrc(file: File): Promise<void> {
    setSelectedFile(file)
    updateSrcPreview(file)
  }

  async function updateSrcPreview(file: File): Promise<void> {
    const filePreview = await window.api.previewFile(file.path, Infinity)
    setSrcPreview(filePreview)
  }

  async function updateResult(content: string): Promise<void> {
    setResult(content)
    await updateResultPreview(content)
  }

  async function updateResultPreview(content: string): Promise<void> {
    const lines: string[] = content.split('\n')
    //const linesToReturn: number = Math.min(10, lines.length)

    const result = lines.slice(0, Infinity)
    setResultPreview(result)
  }

  async function openSaveDialog(): Promise<void> {
    const filePath: string = await window.api.openSaveDialog()

    if (filePath && result) {
      window.api.saveFile(result, filePath)
    }
  }

  async function resultToSource(content: string): Promise<void> {
    if (selectedFile !== undefined) {
      const result: File = await window.api.saveFileTemp(selectedFile.path, content)
      updateSrc(result);
      updateResult("")
    }
  }

  async function inputToSource(content: string): Promise<void> {
    const resultFile: File = await window.api.saveFileTemp('', content)
    updateSrc(resultFile);
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
        resetFile,
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
