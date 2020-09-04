
let dbPromise = idb.open('posts-store', 1 ,function(db){

    if(!db.objectStoreNames.contains('posts')){
          db.createObjectStore('posts',{keyPath: 'id'})  // creates a new store
    }

    if(!db.objectStoreNames.contains('sync-posts')){
        db.createObjectStore('sync-posts',{keyPath: 'id'})
  }
})


function writeData(st,data){
    return dbPromise
     .then(function(db){
        let tx = db.transaction(st,'readwrite');
        let store = tx.objectStore(st);
        store.put(data);
        return tx.complete;
    })
}

function readAllData(st){
    return dbPromise
        .then(db=>{
            let tx =  db.transaction(st,'readonly');
            let store = tx.objectStore(st);
            return store.getAll()
        })
}

function clearAllData(st){
    return dbPromise
        .then(db=>{
            let tx = db.transaction(st,'readwrite');
            let store = tx.objectStore(st);
            store.clear();
            return tx.complete;
        })
}


function deleteItem(st,id){
    dbPromise
        .then(db=>{
            let tx = db.transaction(st,'readwrite');
            let store = tx.objectStore(st);
            store.delete(id);
            return tx.complete;
        })
        .then(function(){
            console.log('Item Deleted From indexDB!');
        })
}


function urlBase64ToUint8Array(base64String){
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
        outputArray = rawData.charCodeAt(i);     
    }  

    return outputArray;

}

function dataURLtoBlob(dataURL) {
    var byteString  = atob(dataURL.split(',')[1]);
    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    var ab =  new ArrayBuffer(byteString.length);
    var ia =  new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
        
    }

    var blob = new Blob([ab], {type:mimeString});
    return blob;
}