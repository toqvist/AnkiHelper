import { dialog, ipcMain } from "electron"
import FileHandler from "../model/fileHandler"
import FileProcessor from "../model/fileProcessor"
import Tools, { WordFreq } from "../model/tools"

export function getHandlers() {
    ipcMain.handle('file:preview', async (event, filePath: string) => {
        try {
            const fileContent = await FileHandler.previewFile(filePath)
            return fileContent
        } catch (error) {
            console.error('Error while reading the file:', error)
            return null
        }
    })

    getProcessHandlers()
    getToolHandlers()
    getFileHandlers()
}

function getProcessHandlers() {
    ipcMain.handle('process:trimSRT', async (event, content: string) => {
        const fileContent = await FileProcessor.trimSRTMetadata(content)
        return fileContent
    })

    ipcMain.handle('process:trimSRTFile', async (event, filePath: string) => {
        const fileContent = await FileProcessor.trimSRTFile(filePath)
        return fileContent
    })
}

function getToolHandlers() {
    ipcMain.handle('tools:wordFrequency', async (event, filePath: string): Promise<WordFreq[]> => {
        const fileContent = await Tools.wordFrequency(filePath, '')
        return fileContent
    })
}

function getFileHandlers() {
    ipcMain.handle('file:saveDialog', async (event): Promise<string | undefined> => {
        const result: Electron.SaveDialogReturnValue = await dialog.showSaveDialog({})
        return result.filePath;
    })

    ipcMain.handle('file:save', async (event, filePath: string, content: string,) => {
        try {
            FileHandler.writeStringToFile(filePath, content)
        } catch (error) {
            console.error('Error while saving the file:', error)
            return null
        }
    })

    ipcMain.handle('file:saveTemp', async (event, filePath: string, content: string): Promise<string | null> => {
        try {
            return FileHandler.writeStringToFile(filePath, content)
        } catch (error) {
            console.error('Error while saving the file:', error)
            return null
        }
    })
}