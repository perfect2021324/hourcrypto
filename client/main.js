const { app, BrowserWindow } = require('electron')
const process = require('process')
const path = require('path')


function createWindow() {
    const win = new BrowserWindow({ width: 800, height: 600 })
    win.loadFile("./dist/crypto-client/index.html")
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})


app.on('window-all-closed', function () { 
    if(process.platform !== 'darwin') app.quit()
})