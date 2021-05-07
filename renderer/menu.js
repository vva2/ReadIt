const { shell, remote } = require('electron');

const template = [
    {
        label: 'Items',
        submenu: [
            {
                label: 'Add New',
                click: window.addNew,
                accelerator: 'CmdOrCtrl+N'
            },
            {
                label: 'Read Item',
                click: window.openItem,
                accelerator: 'CmdOrCtrl+Enter'
            },
            {
                label: 'Delete Item',
                click: window.deleteItem,
                accelerator: 'Delete'
            },
            {
                label: 'Open In Browser',
                click: window.openItemNative,
                accelerator: 'CmdOrCtrl+Shift+Enter'
            },
            {
                label: 'Search Items',
                click: window.searchItems,
                accelerator: 'CmdOrCtrl+F'
            },
        ]
    },
    {
        role: 'editMenu'
    },
    {
        role: 'windowMenu'
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: () => {shell.openExternal('https://github.com/vishal-vardhan')} 
            }

        ]
    }
];

const menu = remote.Menu.buildFromTemplate(template);

remote.Menu.setApplicationMenu(menu);
