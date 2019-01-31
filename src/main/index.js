'use strict'

import electron, { app, BrowserWindow, Menu, dialog } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const enableDevtools = process.env.NODE_ENV !== 'production'
const devServer = process.env.NODE_ENV !== 'production'

let mainWindow

function createRendererWindow() {
  const workarea = electron.screen.getPrimaryDisplay().workAreaSize
  const window = new BrowserWindow({width: workarea.width/2, height: workarea.height, x:workarea.width/2, y:0})

  if (devServer) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}


function launcherCallback(browserWindow, buttonNumber) {
  console.log('buttonNumber Pressed: ', buttonNumber)
  // Now show dialog again
  if (buttonNumber === 0) {
    app.exit()
    return
  }
  showLauncherDialog(browserWindow)
}

function showLauncherDialog(browserWindow) {
  dialog.showMessageBox(browserWindow, {
    type: 'info',
    buttons: ['exit', 'securityScopedBookmarks = false', 'securityScopedBookmarks = true'],
    defaultId: 2,
    title: 'launcher window',
    message: 'Test showOpenDialog() in main process',
  }, (buttonNumber) => {launcherCallback(browserWindow, buttonNumber)})
}

function createLauncherWindow() {
  const window = new BrowserWindow({width: 800, height: 500, x:0, y:0})
  showLauncherDialog(window)
  return window
}


/**
 * Main()
 */

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', () => {
  mainWindow = createLauncherWindow()
  createRendererWindow()

  // Enable copy / paste
  const template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Toggle Devtools (if enabled) - current window", role: 'toggleDevTools'},
            { label: "Reload - current window", role: 'reload'},
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
})
