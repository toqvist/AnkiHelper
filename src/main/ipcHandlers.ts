import { dialog, ipcMain } from 'electron'
import FileHandler from '../model/fileHandler'
import FileProcessor from '../model/fileProcessor'
import Tools, { WordFreq } from '../model/tools'
import { Deck, AnkiConnect } from '../model/ankiConnect'
import { Translator } from '../model/translator'

export function getHandlers(): void {
  getProcessHandlers()
  getToolHandlers()
  getFileHandlers()
  getAnkiHandlers()
}

interface Word {
  text: string
  isPunctuation: boolean
  clozed: boolean
  hint: string
  translations: string[]
}

export interface Sentence {
  words: Word[]
}

function getProcessHandlers(): void {
  ipcMain.handle('process:trimSRT', async (_event, content: string): Promise<string> => {
    const fileContent = await FileProcessor.trimSRTMetadata(content)
    return fileContent
  })

  ipcMain.handle('process:trimSRTFile', async (_event, filePath: string): Promise<string> => {
    const fileContent = await FileProcessor.trimSRTFile(filePath)
    return fileContent
  })
}

function getToolHandlers(): void {
  ipcMain.handle('tools:wordFrequency', async (_event, filePath: string): Promise<WordFreq[]> => {
    const fileContent = await Tools.wordFrequency(filePath, '')
    return fileContent
  })

  ipcMain.handle(
    'tools:usedInSentences',
    async (_event, filePath: string, argWord: string): Promise<Sentence[]> => {
      try {
        const result = await Tools.usedInSentences(filePath, argWord)
        return result
      } catch (error) {
        console.error('Error in usedInSentences:', error)
        return []
      }
    }
  )

  ipcMain.handle(
    'tools:translate',
    async (_event, text: string, targetLanguage: string): Promise<string[]> => {
      try {
        const translatedText = await Translator.translate(text, targetLanguage)
        return translatedText
      } catch (error) {
        console.error('Error translating text:', error)
        throw error
      }
    }
  )
}

function getFileHandlers(): void {
  ipcMain.handle(
    'file:preview',
    async (_event, filePath: string, lines: number): Promise<string[] | null> => {
      try {
        const fileContent = await FileHandler.previewFile(filePath, lines)
        return fileContent
      } catch (error) {
        console.error('Error while reading the file:', error)
        return null
      }
    }
  )

  ipcMain.handle(
    'file:readFileAsSentences',
    async (_event, filePath: string, numLines: number): Promise<Sentence[]> => {
      try {
        const result = await FileHandler.readFileAsSentences(filePath, numLines)
        return result
      } catch (error) {
        throw new Error('Error previewing file')
      }
    }
  )

  ipcMain.handle('file:saveDialog', async (_event): Promise<string | undefined> => {
    const result: Electron.SaveDialogReturnValue = await dialog.showSaveDialog({})
    return result.filePath
  })

  ipcMain.handle(
    'file:save',
    async (_event, filePath: string, content: string): Promise<string | null> => {
      try {
        return await FileHandler.writeStringToFile(filePath, content)
      } catch (error) {
        console.error('Error while saving the file:', error)
        return null
      }
    }
  )

  ipcMain.handle(
    'file:saveTemp',
    async (_event, filePath: string, content: string): Promise<string | null> => {
      try {
        return FileHandler.saveFileTemp(filePath, content)
      } catch (error) {
        console.error('Error while saving the file:', error)
        return null
      }
    }
  )
}

function getAnkiHandlers(): void {
  ipcMain.handle('anki:getDecks', async (_event): Promise<Deck[]> => {
    try {
      const decks = await AnkiConnect.getDecks()
      return decks
    } catch (error) {
      console.error('Error fetching decks:', error)
      return []
    }
  })

  ipcMain.handle(
    'anki:createClozeCard',
    async (_event, deck: string, clozeWords: Word[]): Promise<boolean> => {
      try {
        await AnkiConnect.createClozeCard(deck, clozeWords)
        return true
      } catch (error) {
        console.error('An error occurred:', error)
        return false
      }
    }
  )

  ipcMain.handle('anki:isWordNew', async (_event, word, deckName): Promise<boolean> => {
    const isNew = !(await AnkiConnect.isWordNew(word, deckName))
    return isNew
  })
}
