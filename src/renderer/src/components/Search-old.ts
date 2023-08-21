import { ipcRenderer } from 'electron'
import electronFind from 'electron-find'

function initializeSearchInput() {
  const searchInput: HTMLInputElement | null =
    document.querySelector<HTMLInputElement>('#searchInput')

  if (searchInput !== null) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const query = searchInput.value
        ipcRenderer.send('find', query)
      }
    })
  }
}

// Export an empty object to satisfy the default export requirement
export default {}

// Execute the code immediately
initializeSearchInput()
