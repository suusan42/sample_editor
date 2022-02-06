var editor = null;
var folder_path = null;
var folder_items = null;
var sidebar = null;
var footer = null;
var current_fname = null;
var change_flg = false;

window.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
  let w = BrowserWindow.getFocusedWindow();
  w.on('close', (e)=> {
    savefile();
  });
  footer = document.querySelector('#footer');
  sidebar = document.querySelector('#sidebar');
  editor = ace.edit('editor_area');
  editor.setTheme('ace/theme/textmate');
  setMode("text");
  editor.focus();
  editor.session.getDocument().on('change', (ob)=> {
    change_flg = true;
  });

  // drag & drop

  sidebar.addEventListener("dragover", (event)=> {
    event.preventDefault();
    current_fname = null;
    folder_path = null;
    folder_items = null;
  });

  sidebar.addEventListener('drop', (event) => {
    event.preventDefault();
    editor.session.getDocument().setValue('');
    change_flg = false;
    const folder = event.dataTransfer.files[0];
    folder_path = folder.path;
    loadPath();
  });
}

function replace() {
  document.querySelector('#input_find2').value = '';
  document.querySelector('#input_replace').value = '';
  $('#replace-modal').modal('show');
}

function replacenow() {
  let fstr = document.querySelector('#input_find2').value;
  editor.focus();
  editor.gotoLine(0);
  editor.find(fstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
  replacenext();
}

function replacenext() {
  let rstr = document.querySelector('#input_replace').value;
  editor.replace(rstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
}

function replaceall() {
  let rstr = document.querySelector('#input_replace').value;
  editor.replaceAll(rstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
}

function find() {
  document.querySelector('#input_find').value = '';
  $('#find-modal').modal('show');
}

function search() {
  let fstr = document.querySelector('#input_find').value;
  editor.focus();
  editor.gotoLine(0);
  editor.find(fstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
}

function findnext() {
  editor.findNext();
}
function findprev() {
  editor.findPrevious();
}

function openfolder() {
  let w = BrowserWindow.getFocusedWindow();
  let result = dialog.showOpenDialogSync(w, {
    properties: ['openDirectory']
  });
  if (result != undefined) {
    folder_path = result[0];
    loadPath();
    footer.textContent = 'open dir:"' + folder_path + '".';
  }
}

function loadPath() {
  fs.readdir(folder_path, (err, files)=> {
    folder_items = files;
    let tag = '<ul>';
    for (const n in files) {
      tag += '<li id="item '
        + n + '" onclick="openfile(' 
        + n + ')">' + files[n] + '</li>';
    }
    tag += '</ul>';
    sidebar.innerHTML = tag;
  });
}

function openfile(n) {
  savefile();
  current_fname = folder_items[n];
  let fpath = path.join(folder_path, current_fname);
  fs.readFile(fpath, (err, result)=> {
    if (err == null) {
      let data = result.toString();
      editor.session.getDocument().setValue(data);
      change_flg = false;
      footer.textContent = ' "' + fpath +'" loaded.';
      setExt(current_fname);
    } else {
      dialog.showErrorBox(err.code + err.errno, err.message);
    }
  });
}

function createfile() {
  $('#save-modal').modal('show');
}

function createfileresult() {
  current_fname = document.querySelector('#input_file_name').value;
  let fpath = path.join(folder_path, current_fname);
  fs.writeFile(fpath, '', (err)=> {
    editor.session.getDocument().setValue('');
    footer.textContent = '"' + current_fname + '" createed.';
    change_flg = false;
    loadPath();
  });
}

function savefile() {
  if (!change_flg) { return; }
  let fpath = path.join(folder_path, current_fname);
  let data = editor.session.getDocument().getValue();
  fs.writeFile(fpath, data, (err)=> {
    change_flg = false;
  });
}

function setTheme(tname) {
  editor.setTheme('ace/theme/' + tname);
}

function setMode(mname) {
  editor.session.setMode('ace/mode/' + mname);
}

function setFontSize(n) {
  editor.setFontSize(n);
}

function setExt(fname) {
  let ext = path.extname(fname);
  switch (ext) {
    case '.txt':
    setMode('text'); break;
    case '.js':
    setMode('javascript'); break;
    case '.json':
    setMode('javascript'); break;
    case '.html':
    setMode('html'); break;
    case '.py':
    setMode('python'); break;
    case '.php':
    setMode('php'); break;
  }
}

//editor.gotoLine(1);
//editor.renderer.setShowPrintMargin(false);
