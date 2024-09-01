import { 
    app, 
    BrowserWindow, 
    ipcMain, 
    nativeTheme,
    Menu,
    dialog,
    shell //Para acessar recuros externos
 } from 'electron';
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

  //PRINCIPAL WINDOW
const createWindow = () => {
    nativeTheme.themeSource = 'system';
    const main = new BrowserWindow({
        width: 900,
        height: 500,
        autoHideMenuBar: false,
        resizable: true,
        // icon: caminho
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
        }
    })

    //MENU
    Menu.setApplicationMenu(Menu.buildFromTemplate(templateMenu));
    main.loadFile(join('src', 'index.html'));
}

//ABOUT WINDOW
const createAboutWindow = () => {
    nativeTheme.themeSource = 'system';
    const about = new BrowserWindow({
        width: 360,
        height: 220,
        autoHideMenuBar: true,
        resizable: false,
    })

    about.loadFile(join('src', 'views', 'about.html'));
}

//SECONDARY WINDOW
const createChildWindow = () => {

    const father = BrowserWindow.getFocusedWindow();
    if(father) {
        const child = new BrowserWindow({
            width: 600,
            height: 400,
            autoHideMenuBar: true,
            resizable: false,
            parent: father,  //Para fazer com que esta janela junto seja fechada com a janela pai,
            modal: true //Foco nesta janela para não permitir que o utilizador 
                        //interaja com a janela pai enquanto esta estiver aberta 
        })

        child.loadFile(join('src', 'views', 'child.html'))
    }
}


app.whenReady().then(()=> {
    createWindow();
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) 
            createWindow();
    })
    
    //===================== IPC ===================================

    ipcMain.on('open-child-window', () => createChildWindow());
    ipcMain.on('messageFromRendererProcess', (event, message) => {
        console.log('receiving the message from renderer process: ');
        console.log(message);
        event.reply('responseFromMainProcess', "Replying the message to renderer process!!");
    })

    ipcMain.on('dialog-info', (event, message) =>{
        dialog.showMessageBox({
            type: "info",
            title: "Information",
            message,
            buttons: ['OK']
        })
    } )

    ipcMain.on('dialog-warning', (event, message) => {
        dialog.showMessageBox({
            type: 'warning',
            title: 'My warning',
            message,
            buttons: ['Yes', 'No'],
            defaultId: 0
        }).then(result => {
            if(result.response === 0) console.log('Confirmed');
        })
    })

    ipcMain.on('dialog-choose', () => {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        })
        .then(result => {
            if(!result.canceled){
                console.log('Configured path::')
                console.log(join(result.filePaths[0]));
            }
        }) 
        .catch(error => console.log(error));
    })

 
    ipcMain.handle('get-version', () => process.versions.electron)
    //===================== IPC ===================================
})


app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
        app.quit();
})


const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Secondary window',
                click: () => createChildWindow() 
            },
            {
                label: 'Quit',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]

    },
    {
        label: 'preferences',
        submenu: [
            {
                label: 'Reload',
                role: 'reload'
            },
            {
                label: 'Dev tools',
                role: 'toggleDevTools'
            },
            { type: 'separator'},
            {
                label: 'default zoom',
                role: 'resetZoom'
            },
            {
                label: 'Increase zoom',
                role: 'zoomIn'
            },
            {
                label: 'Decrease zoom',
                role: 'zoomOut'
            }
        ]
        
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: () => createAboutWindow(),
            },
            {type: 'separator'},
            {
                label: 'docs',
                click: () => shell.openExternal('https://www.electronjs.org/docs')
            }
        ]
    }
]

