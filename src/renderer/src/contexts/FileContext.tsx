import React, { createContext, useContext, useState, ReactNode } from 'react'
import path from 'path'; // Import the path module

interface FileContextType {
  resetFile: () => void,
  selectedFile: CustomFile
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

interface CustomFile {
  name: string,
  path: string,
  type: string,
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {

  const defaultFile: CustomFile = {
    name: "",
    path: "",
    type: "",
  };

  const [selectedFile, setSelectedFile] = useState<CustomFile>(defaultFile)
  const [srcPreview, setSrcPreview] = useState<string[]>([])

  const [result, setResult] = useState<string>('')
  const [resultPreview, setResultPreview] = useState<string[]>([])

  const [processing, setProcessing] = useState<boolean>(false)

  function resetFile() {
    setSelectedFile(defaultFile);
  };

  async function updateSrc(file: CustomFile): Promise<void> {
    setSelectedFile(file)
    updateSrcPreview(file)
  }

  async function updateSrcPreview(file: CustomFile): Promise<void> {
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
      const resultPath: string = await window.api.saveFileTemp(selectedFile.path, content);
      const fileName: string = extractFileName(resultPath);

      const fileObj: CustomFile = {
        name: fileName,
        path: resultPath,
        type: 'text/plain',
      };

      updateSrc(fileObj);
      updateResult("");
    }
  }


  async function inputToSource(content: string): Promise<void> {
    const resultPath: string = await window.api.saveFileTemp('', content);
    const fileName: string = extractFileName(resultPath);

    const fileObj: CustomFile = {
      name: fileName,
      path: resultPath,
      type: 'text/plain',
    };

    setSelectedFile(fileObj);
  }

  function extractFileName(filePath: string): string {
    const lastSlashIndex = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
    return lastSlashIndex !== -1 ? filePath.slice(lastSlashIndex + 1) : filePath;
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
