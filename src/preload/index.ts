import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  trimSRT: (content: string) => ipcRenderer.invoke('process:trimSRT', content),
  trimSRTFile: (filePath: string) => ipcRenderer.invoke('process:trimSRTFile', filePath),
  previewFile: (filePath: string) => ipcRenderer.invoke('file:preview', filePath),
  openSaveDialog: () => ipcRenderer.invoke('file:saveDialog'),
  saveFile: (content: string, filePath: string) => ipcRenderer.invoke('file:save'),
}

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