import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FileContextType {
    selectedFile: string;
    setSelectedFile: (fileName: string) => void;
    srcPreview: string[];
    resultPreview: string[];
    updateSrcPreview: (fileName: string) => void;
    updateResultPreview: (content: string) => void;
    openSaveDialog: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

interface FileProviderProps {
    children: ReactNode;
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [srcPreview, setSrcPreview] = useState<string[]>([]);
    const [resultPreview, setResultPreview] = useState<string[]>([]);
    
    async function updateSrcPreview (filePath: string): Promise<void> {
        const filePreview = await window.api.previewFile(filePath)
        setSrcPreview(filePreview);
    }

    async function updateResultPreview (content: string): Promise<void> {
        const lines = content.split('\n');
        const linesToReturn = Math.min(10, lines.length);
    
        const result = lines.slice(0, linesToReturn);
        setResultPreview(result);
    }

    async function openSaveDialog(): Promise<void> {
        const filePath: string = await window.api.openSaveDialog();
        if (filePath) {
          // Perform actions with the selected file path
          console.log('Selected save location:', filePath);
          // You can now save the file using JavaScript, perform further actions, etc.
        }
      }

    return (
        <FileContext.Provider value={{ selectedFile, setSelectedFile, srcPreview, resultPreview, updateSrcPreview, updateResultPreview, openSaveDialog }}>
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
