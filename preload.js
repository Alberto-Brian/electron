const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
    versionElectron: () => ipcRenderer.invoke('get-version'),
    verElectron: () => process.versions.electron,
    openChildWindow: () =>  ipcRenderer.send('open-child-window'),
    sendMessage: (message) => ipcRenderer.send('messageFromRendererProcess', message),
    receiveMessage: (message) => ipcRenderer.on('responseFromMainProcess', message),

    info: (message) => ipcRenderer.send('dialog-info', message),
    warning: (message) => ipcRenderer.send('dialog-warning', message),
    choose: (message) => ipcRenderer.send('dialog-choose'),
})


//DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    const date = document.getElementById('date');
    date.innerText = getDate();
})


// FUNCTIONS FOR DOMContentLoaded
function getDate(){
    const date = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return date.toLocaleDateString('pt-PT', options);
}