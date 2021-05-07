const fs = require('fs');

let items = document.getElementById('items');
let readerJS;

fs.readFile(`${__dirname}/readerJS.js`, (err, data) => {
    readerJS = data.toString();
});

exports.getSelectedItem = () => {
    if(this.storage.length === 0) return;

    let index = 0;
    let node = document.getElementsByClassName('read-item selected')[0];
    let cur = node;

    while((cur = cur.previousSibling) != null) index++;

    return {
        index: index,
        node: node
    };
};

exports.storage = JSON.parse(localStorage.getItem('readIt-items')) || [];

exports.save = e => {
    localStorage.setItem('readIt-items', JSON.stringify(this.storage));
};

exports.select = e => {
    this.getSelectedItem().node.classList.remove('selected');
    e.currentTarget.classList.add('selected');
};

exports.open = () => {
    let selectedItem = this.getSelectedItem();
    let url = selectedItem.node.dataset.url;
    let index = selectedItem.index;
    let readerWin = window.open(url, '', `
        maxWidth=2000,
        maxHeight=2000,
        nodeIntegration=0,
        contentIsolation=1,
        width=1000,
        height=700,
        backgroundColor=#DEDEDE
    `);

    readerWin.eval(readerJS.replace('{{index}}', index));
};

exports.addItem = (item, isNew=true) => {
    let itemNode = document.createElement('div');
    itemNode.setAttribute('class', 'read-item');
    itemNode.setAttribute('data-url', item.url);
    itemNode.innerHTML = `<img src="${item.screenshot}"><h4>${item.title}</h4>`
    items.appendChild(itemNode);

    if(isNew) {
        this.storage.push(item);
        this.save();
    }

    itemNode.addEventListener('click', this.select);
    itemNode.addEventListener('dblclick', this.open);

    if(document.getElementsByClassName('read-item').length === 1)
        itemNode.classList.add('selected');
};

this.storage.forEach(item => {
    this.addItem(item, false);
});

exports.changeSelection = (key) => {
    let selected = this.getSelectedItem().node;
    if(key === 'ArrowUp' && selected.previousSibling) {
        selected.classList.remove('selected');
        selected.previousSibling.classList.add('selected');
    }
    else if (key === 'ArrowDown' && selected.nextSibling) {
        selected.classList.remove('selected');
        selected.nextSibling.classList.add('selected');
    }
};

exports.delete = (index) => {
    items.removeChild(items.childNodes[index]);
    this.storage.splice(index, 1);
    this.save();

    index = Math.max(0, index-1);
    document.getElementsByClassName('read-item')[index].classList.add('selected');
};

window.addEventListener('message', e => {
    if(e.data.action === 'delete-reader-item') {
        e.source.close();
        this.delete(e.data.index);
    }
});
