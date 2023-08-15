import { ipcRenderer } from 'electron';
import FindInPage from 'electron-find';

//TODO: Finish search feature
//ipcRenderer.on crashes electron for some reason
export function initializeFind() {
    ipcRenderer.on('on-find', (e, args) => {
        const findInPage = new FindInPage(window.api.getCurrentWebContents());
        findInPage.openFindWindow();
    });
    console.log("initalized find")
}
