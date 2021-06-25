const { contextBridge, ipcRenderer} = require('electron')
const Store = require('electron-store');

const store = new Store();


contextBridge.exposeInMainWorld(
    'electron',
    {
        storeEntry: (id,object) => {
            console.log("Store entry is called!");
            console.log(object);
            store.set(id,object);
        },
        getEntries: () => {
            console.log("Get entries is called! All data: ", store.store);
            console.log("path: ",store.path);
            return store.store;
        }
    }
)

// store.set({foo: {bar: {foobar: '🦄'}}});
