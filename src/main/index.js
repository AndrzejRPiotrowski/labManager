'use strict'

import {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} from 'electron'

// import VueRouter from 'vue-router'
const {autoUpdater} = require("electron-updater")
const path = require('path')
// const { dialog } = require('electron')
// const log = require("electron-log")
// log.transports.file.level = 'debug'
// autoUpdater.logger = log


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`


function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    icon: path.join(__static, 'tooth.ico')
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)

  // autoUpdater.checkForUpdatesAndNotify()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
})

const menuTemplate = [{
  label: 'Archivo',
  submenu: [
    {
      label: 'Nuevo fichero de datos',
      click () {
        // createAddWindow ()
      }
    },
    {
      label: 'Abrir archivo',
      click () {
        // mainWindow.webContents.send('todo:clear')
      }
    },
    {
      label: 'Guardar copia de seguridad',
      click () {
        // mainWindow.webContents.send('todo:clear')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Salir',
      accelerator: process.platform === 'darwing' ? 'Command+Q' : 'Alt+F4',
      role: 'quit'
    }
  ]
}, {
  label: 'Edición',
  submenu: [
    {
      label: 'Deshacer',
      accelerator: 'Ctrl+Z',
      role: 'undo'
    },
    {
      label: 'Rehacer',
      accelerator: 'Ctrl+Y',
      role: 'redo'
    },
    {
      type: 'separator'
    },
    {
      label: 'Cortar',
      accelerator: 'Ctrl+X',
      role: 'cut'
    },
    {
      label: 'Copiar',
      accelerator: 'Ctrl+C',
      role: 'copy'
    },
    {
      label: 'Pegar',
      accelerator: 'Ctrl+V',
      role: 'paste'
    },
    {
      type: 'separator'
    },
    {
      label: 'Buscar',
      accelerator: 'Ctrl+B',
      click () {}
    }
  ]
},
{
  label: 'Mantenimientos',
  submenu: [
    {
      label: 'Catálogo',
      click () {
        mainWindow.webContents.send
        ('navigation:navigateTo', {page: '/maintenace/catalog'})
      }
    }
  ]
},
{
  label: 'Ayuda',
  submenu: [
    {
      label: 'Acerca de',
      click () {
        mainWindow.webContents.send
        ('navigation:navigateTo', {page: '/about'})
      }
    }
  ]
}]

// due to OSX way of render menus, you must leave an empty element to make your app interoperable
if (process.platform === 'darwin') {
  menuTemplate.unshift({})
}

if (process.env.NODE_ENV !== 'production') {
  // 'production', 'staging', 'development', 'test'
  menuTemplate.push({
    label: 'Desarrollo',
    submenu: [
      {
        label: 'Herramientas de desarrollo',
        accelerator: process.platform === 'darwing' ? 'Command+Alt+I' : 'F12',
        click (item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      },
      {
        label: 'Recargar',
        role: 'reload'
        // For reloading the full page inside the window
      }
    ]
  })
}

// const remote = require('remote')
// const Menu1 = remote.require('menu')
// const MenuItem1 = remote.require('menu-item')

// let rightClickPosition = null

// const contextualMenu = new Menu1()
// const menuItem = new MenuItem1(
//   {
//     label: 'Inspeccionar elemento',
//     click () {
//       remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y)
//     }
//   }
// )
// contextualMenu.append(menuItem)

// window.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
//   rightClickPosition = {
//     x: event.x,
//     y: event.y
//   }
//   contextualMenu.popup(remote.getCurrentWindow())
// }, false)

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
