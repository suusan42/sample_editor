const { remote } = require('electron');
const { dialog, BrowserWindow } = remote;

window.remote = remote;
window.BrowserWindow = BrowserWindow;
window.dialog = dialog;

const fs = require('fs');
window.fs = fs;
const path = require('path');
window.path = path;
