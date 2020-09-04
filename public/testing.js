self.addEventListener('fetch',event=>{
    let url = 'www.morewithGod.com';

    if(event.request.url.indexOf(url) > -1){
        event.respondWith(
            fetch(event.request)
        )
    }

    event.respondWith(
        caches.match(event.request)
            .then(response=>{
                if(response){
                    return response
                }else{
                    return fetch(event.request)
                }
            })
    )
})

let url = 'morw.com'
let networkdata = false;

fetch(url)
.then(res=>{
    return res.json()
})
.then(data=>{
    networkdata = true;
    console.log(data)
})

if('cache' in window){
    caches.match(url)
      .then(res=>{
          return res.json()
      })
      .then(data=>{
        if(networkdata !== true){
            console.log(data)
        }
      })
     
}


// network only strategy
// self.addEventListener('fetch',event=>{
//     event.respondWith(
//          fetch(event.request)
//     )
// })

// cache only strategy
// self.addEventListener('fetch',event=>{
//     event.respondWith(
//         caches.match(event.request)
//     )
// })

// network with cache fallback strategy
// self.addEventListener('fetch',event=>{
//     event.respondWith(
//         fetch(event.request)
//           .then(response=>{
//               if(response){
//                   return response
//               }else{
//                   return caches.match(event.request)
//                    .then(res=>{
//                        return res
//                    })
//               }
//           })
//     )
// })

//another pattern for network with cache fallback joined with dynamic caching strategy
// self.addEventListener('fetch',event=>{
//     event.respondWith(
//         fetch(event.request)
//             .then(res=>{
//                 return caches.open(CACHE_DYNAMIC)
//                   .then(cache=>{
//                       cache.put(event.request.url, res.clone())
//                       return res
//                   })
//             })
//           .catch(err=>{
//             return caches.match(event.request)
//           })
//     )
// })

// cache then network strategy
// self.addEventListener('fetch',event=>{
//     event.respondWith(
//         caches.match(event.request)
//             .then(res=>{
//                 if(res){
//                     return res
//                 }else{
//                     return fetch(event.request)
//                       .then(response=>{
//                           return caches.open(CACHE_DYNAMIC)
//                             .then(cache=>{
//                                 cache.put(event.request.url, response.clone)
//                                 return response
//                             })
//                       })
//                 }
//             })
//             .catch(err=>{
//                 return caches.open(CACHE_STATIC)
//                     .then(cache=>{
//                         return cache.match('/offline.html')
//                     })
//             })
//     )
// })


// self.addEventListener('fetch',function(event){
//     // console.log('[Service Worker] fetching',event);
//     event.respondWith(
//         caches.match(event.request)
//             .then(response=>{
//                 if(response){
//                     return response
//                 }else{
//                     return fetch(event.request)
//                         .then(res=>{
//                             return caches.open(CACHE_DYNAMIC)
//                                .then(cache=>{
//                                    cache.put(event.request.url, res.clone());
//                                    return res;
//                                })
//                         })
//                          .catch(err=>{
//                             //  console.log(err)
//                             caches.open(CACHE_STATIC)
//                               .then(cache=>{
//                                   return cache.match('/offline.html');
//                               })
//                          })
//                 }
//             })
//     )
// })
