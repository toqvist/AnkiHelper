import { dialog, ipcMain } from "electron"
import FileHandler from "../model/fileHandler"
import FileProcessor from "../model/fileProcessor"
import Tools, { WordFreq } from "../model/tools"
import {Deck, AnkiConnect } from "../model/ankiConnect"
import { Translator } from "../model/translator"

export function getHandlers() {
    getProcessHandlers()
    getToolHandlers()
    getFileHandlers()
    getAnkiHandlers()
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

    ipcMain.handle('tools:usedInSentences', async (event, filePath, argWord) => {
        try {
          const result = await Tools.usedInSentences(filePath, argWord);
          return result;
        } catch (error) {
          console.error('Error in usedInSentences:', error);
          return [];
        }
      });

      ipcMain.handle('tools:translate', async (event, text: string, targetLanguage: string): Promise<string[]> => {
        try {
          const translatedText = await Translator.translate(text, targetLanguage);
          return translatedText;
        } catch (error) {
          console.error('Error translating text:', error);
          throw error;
        }
      });
}

function getFileHandlers() {
    ipcMain.handle('file:preview', async (event, filePath: string, lines: number) => {
        try {
            const fileContent = await FileHandler.previewFile(filePath, lines)
            return fileContent
        } catch (error) {
            console.error('Error while reading the file:', error)
            return null
        }
    })

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
            return FileHandler.saveFileTemp(filePath, content)
        } catch (error) {
            console.error('Error while saving the file:', error)
            return null
        }
    })
}

function getAnkiHandlers() {
    ipcMain.handle('anki:getDecks', async (event): Promise<Deck[]> => {
        try {
            const decks = await AnkiConnect.getDecks();
            return decks;
        } catch (error) {
            console.error('Error fetching decks:', error);
            return [];
        }
    });
    
    ipcMain.handle('anki:createClozeCard', async (event, deck: string, sentence: string, clozeWords: string[]): Promise<boolean> => {
        try {
            await AnkiConnect.createClozeCard(deck, sentence, clozeWords);
            return true;
        } catch (error) {
            console.error('An error occurred:', error);
            return false;
        }
    });
}