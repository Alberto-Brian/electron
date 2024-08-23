const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    versionElectron: () => ipcRenderer.invoke('get-version')
})
