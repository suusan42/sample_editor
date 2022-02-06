const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      enableRemoteModule: true,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });
  win.loadFile('index.html');
  //win.webContents.openDevTools();
  return win.id;
}

function createMenu() {
  let menu_temp = [
    {
      label: 'File',
      submenu: [
        {label: 'New', 
        accelerator :'CommandOrControl+n', 
        click: ()=>{
          createWindow();
        }},
        {label: 'Open folder...', 
        accelerator :'CommandOrControl+o', 
          click: ()=>{
            openfolder();
          }},
        {label: 'Create file', click: ()=>{
          createfile();
        }},
        {role: 'close'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    },
    {role: 'editMenu'},
    {
      label: 'Theme',
      submenu: [
        {label: 'textmate', 
          click: ()=> setTheme('textmate') },
        {label: 'chrome', 
          click: ()=> setTheme('chrome') },
        {label: 'github', 
          click: ()=> setTheme('github') },
        {label: 'dracula', 
          click: ()=> setTheme('dracula') },
        {label: 'twilight', 
          click: ()=> setTheme('twilight') },
          {label: 'pastel on dark ', 
          click: ()=> setTheme('pastel_on_dark') }
      ]
    },
    {
      label: 'Mode',
      submenu: [
        {label: 'text', 
          click: ()=> setMode('text') },
        {label: 'javascript', 
          click: ()=> setMode('javascript') },
        {label: 'html', 
          click: ()=> setMode('html') },
        {label: 'python', 
          click: ()=> setMode('python') },
        {label: 'php', 
          click: ()=> setMode('php') }
      ]
    },
    {
      label: 'Font',
      submenu: [
        {label: '9', 
          click: ()=> setFontSize(9) },
          {label: '10', 
          click: ()=> setFontSize(10) },
          {label: '12', 
          click: ()=> setFontSize(12) },
          {label: '14', 
          click: ()=> setFontSize(14) },
          {label: '16', 
          click: ()=> setFontSize(16) },
          {label: '18', 
          click: ()=> setFontSize(18) },
          {label: '20', 
          click: ()=> setFontSize(20) },
          {label: '24', 
          click: ()=> setFontSize(24) },
      ]
    },
    {
      label: 'Find',
      submenu: [
        {label: 'Find...', click: ()=>{
          find();
        }},
        {label: 'Find Next', 
          accelerator :'CommandOrControl+right', 
          click: ()=>{
            findnext();
          }},
        {label: 'Find Prev', 
        accelerator :'CommandOrControl+left', 
          click: ()=>{
            findprev();
          }},
        {type: 'separator'},
        {label: 'Replace...', click: ()=>{
          replace();
        }},
        {label: 'Replace Next', 
          accelerator :'CommandOrControl+r', 
          click: ()=>{
            replacenext();
          }},
        {label: 'Replace All', 
          click: ()=>{
            replaceall();
          }},
      ]
    },
  ];
  let menu = Menu.buildFromTemplate(menu_temp);
  Menu.setApplicationMenu(menu);
}

function replace() {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('replace()');
}
function replacenext() {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('replacenext()');
}
function replaceall() {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('replaceall()');
}

function find() {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('find()');
}
function findnext() {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('findnext()');
}
function findprev() {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('findprev()');
}

function setFontSize(n) {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('setFontSize(' + n + ')');
}

function openfolder() {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('openfolder()');
}

function createfile() {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('createfile()');
}

function setTheme(tname) {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('setTheme("' + tname + '")');
}

function setMode(mname) {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('setMode("' + mname + '")');
}

createMenu();
app.whenReady().then(createWindow);
