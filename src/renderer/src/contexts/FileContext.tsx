import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FileContextType {
  selectedFile: string;
  setSelectedFile: (fileName: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

interface FileProviderProps {
  children: ReactNode;
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<string>('');

  return (
    <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within the FileProvider');
  }
  return context;
};
