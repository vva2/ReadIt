// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer, shell} = require('electron');
const windowStateKeeper = require('electron-window-state');
const items = require('./items');

let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search');

showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

const toggleModalButtons = () => {
    if(addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModal.style.display = 'inline';
    }
    else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
};

closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
});

addItem.addEventListener('click', e => {
    if(itemUrl.value) {
        toggleModalButtons();
        
        ipcRenderer.send('new-item', itemUrl.value);
    }
});

itemUrl.addEventListener('keyup', e => {
    if(e.key === 'Enter' && itemUrl.value) {
        toggleModalButtons();
        ipcRenderer.send('new-item', itemUrl.value);
    }
});

ipcRenderer.on('new-item-success', (e, newItem) => {
    items.addItem(newItem);
    toggleModalButtons();
    modal.style.display = 'none';
    itemUrl.value = '';
});


search.addEventListener('keyup', () => {
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        let hasMatch = item.innerText.toLowerCase().includes(search.value.toLowerCase());        
        item.style.display = (hasMatch)? 'flex': 'none';
    });
});

document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown')
        items.changeSelection(e.key);
});

window.addNew = () => {
    showModal.click();
};

window.openItem = items.open;

window.deleteItem = () => {
    let selected = items.getSelectedItem();
    if(!selected) return;

    items.delete(selected.index);
};

window.openItemNative = () => {
    let selected = items.getSelectedItem();
    if(!selected) return;

    shell.openExternal(selected.node.dataset.url);
}

window.searchItems = () => {
    search.focus();
};