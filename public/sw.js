importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');




let CACHE_STATIC = 'static-v24';
let CACHE_DYNAMIC = 'dynamic';
let STATIC_FILES = [
    '/index.html',
    '/offline.html',
    '/src/js/idb.js',
    '/src/js/utitlity.js',
    '/src/css/feed.css',
    '/src/css/app.css',
    '/src/js/app.js',
    '/src/js/fetch.js',
    '/src/js/promise.js',
    '/src/material.min.js',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
    

]



//Used at fetch event
function isInArray(string,array){
    for (let i = 0; i < array.length; i++) {
        if(array[i] === string){
            return true
        }
    }
    return false;
}



// Trim cache in order to remove cache and mainitain a particular number of saved cache
// It can be called before saving a new cache dynamically or anywhere else but we used it in fetch event

// function trimCache(cachename,maxlen){
//     caches.open(cachename)
//         .then(cache=>{
//             return cache.keys()
//             .then(key=>{
//                 if(key.length < maxlen){
//                     cache.delete(key[0])
//                     .then (trimCache(cachename,maxlen))
//                 }
//             })
//         })   
// }

//Installation event
self.addEventListener('install', function(event){
    console.log('[Service Worker] installing',event)
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(cache=>{
                console.log('[Service worker] Precaching App Shell');
                cache.addAll(STATIC_FILES)
            })
    )

})

//Activation event
self.addEventListener('activate',function(event){
    console.log('[Service Worker] activating', event);
    event.waitUntil(
        caches.keys()
            .then(keylist=>{
                return Promise.all(keylist.map(function(key){
                    if(key !== CACHE_STATIC && key !== CACHE_DYNAMIC){
                        console.log('[Service worker] deleting old caches',key)
                        return  caches.delete(key)
                    }
                }))
            })
    )
    return self.clients.claim();
})

//Fetching event
self.addEventListener('fetch',function(event){
    let url = 'https://atutechs-pwa.firebaseio.com/Posts';

    if(event.request.url.indexOf(url) > -1){
        event.respondWith(
                fetch(event.request)
                   .then(function(res){
                    let resClone = res.clone()
                        clearAllData('posts')  // clearing items before writing new ones 
                            .then(function(){
                                return resClone.json()
                            })
                            .then(function(data){
                                for( var key in data){
                                    writeData('posts',data[key])  // writing item
                                    console.log('SENDING DATA TO indexDB')

                                    // Practising deleting a single item 
                                    // .then(function(){
                                    //     deleteItem('posts',key)
                                    // })
                                    // 
                                }
                            })                
                       return res;
                   })
            //   })
        )
    }else if(isInArray(event.request.url,STATIC_FILES)){
        event.respondWith(
        caches.match(event.request)
        )
    }else{
       event.respondWith(
        caches.match(event.request)
        .then(function(res){
            if(res){
                return res;
            }else{
                return fetch(event.request)
                  .then(function(response){
                      return caches.open(CACHE_DYNAMIC)
                        .then(function(cache){
                            //  trimCache(CACHE_DYNAMIC,3)
                            cache.put(event.request.url, response.clone());
                            return response;
                        })
                  })
            }
        })
        .catch(function(err){
            return caches.open(CACHE_STATIC)
                .then(function(cache){
                    if(event.request.headers.get('accept').includes('text/html')){
                        return cache.match('/offline.html')
                    }
                })
        })
       )
    }
    
})




// Sync Function
self.addEventListener('sync',event=>{
    console.log('[Service worker] synching...',event);

    if(event.tag === 'sync-new-posts'){
        console.log('[Service worker] synching new posts');

        event.waitUntil(
            readAllData('sync-posts')
             .then(function(data){
                //sending to firebase
               for (let dt of data) {
                 let postData = new FormData();
                 postData.append('id',dt.id);
                 postData.append('title',dt.title);  
                 postData.append('location',dt.location); 
                 postData.append('rawLocationLat',dt.rawLocation.lat);
                 postData.append('rawLocationLng',dt.rawLocation.lng); 
                 postData.append('file',dt.picture, dt.id + '.png');  


                fetch('https://atutechs-pwa.firebaseio.com/Posts',{
                method: "POST",
                // headers:{
                // "Content-Type":"application/json",
                // "Accept":"application/json"
                // },
                // body: JSON.stringify({
                // id: dt.id,
                // title: dt.title,
                // location: dt.location,
                // image: "https://firebasestorage.googleapis.com/v0/b/atutechs-pwa.appspot.com/o/sf-boat.jpg?alt=media&token=fbe2bd1a-28cd-46ef-b1b6-0acf4a34b25b"
                // })
                body: postData

                })
                .then(res=>{
                    console.log('Sent to firebase',res);
                    if(res.ok){
                        res.json()
                          .then(resData=>{
                            deleteItem('sync-posts',resData.id)
                          })
                    }
                })
                .catch(err=>{
                    console.log('Error while sending data:',err)
                })


            }
            

             })
        )
    }
})


// notification open using serviceWorker
self.addEventListener('notificationclick',event=>{
    let notification = event.notification;
    let action = event.action;
    console.log(`[serviceWorker] listenting to notification.... ${notification}`)

    if(action === 'confirm'){
        console.log('Confirm was clicked');
        notification.close();
        
    }else{
        event.waitUntil(
            clients.matchAll()
             .then(function(clis){
                let client = clis.find(function(c){
                    return c.visibilityState === 'visible';
                });

                if(client !== undefined){
                    client.navigate(notificaton.data.url);
                    client.focus()
                }else{
                  clients.openWindow(notificaton.data.url);

                }
                console.log(`Confirm was selected...${action}`)
                 notification.close();
             })
        )
    }
})

// notification close using serviceWorker
self.addEventListener('notificationclose',event=>{
    console.log(`[serviceWorker] closing notification.... ${event}`)

})


// push from serviceWorker
self.addEventListener('push',function(event){
    console.log('[serviceWorker] push event',event);

    let data = {title:'New!', content: 'New Event Occurred',openUrl:'/'};

    if(event.data){
        data -  JSON.parse(event.data.text());
    }

    let options = {
        body : data.content,
        icon : '/src/images/icons/app-icon-96x96.png',
        image : '/src/images/sf-boat',
        vibration : [100,20,250],
        lang : 'en-US',
        badge : '/src/images/icons/app-icon-96x96.png',    
        data:{
            url: data.openUrl
        } 

    }
    event.waitUntil(
        self.registration.showNotification(data.title,options)
    )
})