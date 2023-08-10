import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  trimSRT: (content: string) => ipcRenderer.invoke('process:trimSRT', content),
  trimSRTFile: (filePath: string) => ipcRenderer.invoke('process:trimSRTFile', filePath),
  previewFile: (filePath: string, lines: number) => ipcRenderer.invoke('file:preview', filePath, lines),
  readFileAsSentences: (filePath: string, lines: number) => ipcRenderer.invoke('file:readFileAsSentences',filePath, lines),
  openSaveDialog: () => ipcRenderer.invoke('file:saveDialog'),
  saveFileTemp: (filePath: string, content: string) => ipcRenderer.invoke('file:saveTemp', filePath, content),
  saveFile: (content: string, filePath: string) => ipcRenderer.invoke('file:save', content, filePath),
  wordFrequency: (filePath: string) => ipcRenderer.invoke('tools:wordFrequency', filePath),
  getDecks: () => ipcRenderer.invoke('anki:getDecks'),
  createClozeCard: (deck: string, sentence: string, clozeWords: string[]) =>
    ipcRenderer.invoke('anki:createClozeCard', deck, sentence, clozeWords),
  isWordNew: (word, deck) => ipcRenderer.invoke('anki:isWordNew', word, deck),
  usedInSentences: (filePath: string, argWord: string) => ipcRenderer.invoke('tools:usedInSentences', filePath, argWord),
  translate: (text: string, targetLanguage: string) => ipcRenderer.invoke('tools:translate', text, targetLanguage),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

/* contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
}) */
