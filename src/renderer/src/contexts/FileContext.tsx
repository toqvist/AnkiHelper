import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FileContextType {
    selectedFile: string;
    setSelectedFile: (fileName: string) => void;
    preview: string[];
    updatePreview: (fileName: string) => void;
}

declare global {
    interface Window {
      api: {
        previewFile: (filePath: string) => Promise<string[]>;
      };
    }
  }

const FileContext = createContext<FileContextType | undefined>(undefined);

interface FileProviderProps {
    children: ReactNode;
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [preview, setPreview] = useState<string[]>([]);
    

    async function updatePreview (filePath: string) {
        /* const fileContent = await ipcRenderer.invoke('file:preview', filePath); */
        const fileContent = await window.api.previewFile(filePath)
        setPreview(fileContent);
    }

    /* function updatePreview () {} */

    return (
        <FileContext.Provider value={{ selectedFile, setSelectedFile, preview, updatePreview }}>
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
