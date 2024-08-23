import { app, BrowserWindow, ipcMain } from 'electron';
// import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtenha o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('electron version: ', process.versions.electron);

// Recarregar o Electron durante o desenvolvimento
if (process.env.NODE_ENV === 'development') {
    require('electron-reloader')(module, {
      // Configurações de recarregamento
      debug: true,
      watchRenderer: true
    });
  }

const createWindow = () => {
    const main = new BrowserWindow({
        height: 800,
        width: 1000,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
        }
    })

    main.loadFile(join('src', 'index.html'));
}

app.whenReady().then(()=> {
    createWindow();
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) 
            createWindow();
    })


    ipcMain.handle('get-version', () => process.versions.electron)
})


app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
        app.quit();
})

