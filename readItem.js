const {BrowserWindow} = require('electron');

let offScreenWin;

module.exports = (itemUrl, callback) => {
    offScreenWin = new BrowserWindow({
        width: 500, height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    });

    offScreenWin.loadURL(itemUrl);
    offScreenWin.webContents.on('did-finish-load', () => {
        let title = offScreenWin.getTitle();
        offScreenWin.capturePage().then(image => {
            let screenshot = image.toDataURL();
            callback({
                title: title,
                screenshot: screenshot,
                url: itemUrl
            });
        });

        offScreenWin.close();
        offScreenWin = null;
    })
};