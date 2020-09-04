let defferedOption = '';
let pushNotifBTN = document.querySelectorAll('.enable-notifications');


if(!window.Promise){
    window.Promise = Promise;
}

// Registering a service worker
if('serviceWorker' in navigator){
    navigator.serviceWorker
    .register('/service-worker.js')
      .then(function(){
          console.log('Service worker registered');
      })
       .catch(function(err){
           console.log(err);
       })
}

// Stopping windows from prompting install banner
window.addEventListener('beforeinstallprompt',function(event){
    console.log('Before install prompt triggered');
    event.preventDefault();
    defferedOption = event;
    return false;
})


// Checking for Notification in windows
if('Notification' in window){
    for (let i = 0; i < pushNotifBTN.length; i++) {
        pushNotifBTN[i].style.display = 'block';
        pushNotifBTN[i].addEventListener('click',Notif_ASK_Permission);       
    }
}


// Notification Function
function Notif_ASK_Permission(){
    Notification.requestPermission(result=>{
        console.log(`User's choice ${result}`)
        if(result !== 'granted'){
            console.log('User rejected permission');
        }else{
            // displayConfirmNotif()
            pushNotifSub()
            console.log('Notification enabled')
        }
    })
}


var reg

// pushNotificationSub
function pushNotifSub(){
    if(!'serviceWorker' in navigator){
        return;
    }

    navigator.serviceWorker.ready
        .then(swreg=>{
            reg = swreg;
            return swreg.pushManager.getSubscription()
        })
        .then(function(sub){
            if(sub === null){
                // create subscription

                var validpublicKey = 'BMDPGPn3JLNE5T3dlnyS905VuZ9RWU34nfQAQVYH21HGt_FAjPekLdZjc0JuMzelv-tpVY6VTQqz5m6hF-m9vWE';  // from npm run web-push generate-vapid-keys
                var convertedPublicKey = urlBase64ToUint8Array(validpublicKey);
                reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedPublicKey
                })
                
            }else{
                // subscription exists
            }
        })
        .then(function(newSub){
            return fetch('https://atutechs-pwa.firebaseio.com/Subscriptions.json',{
                method: "POST",
                headers:{
                    "Content-Type":"applicaton/json",
                    "Accept":"application/json"
                },
                body:JSON.stringify(newSub)
            })
        })
        .then(function(res){
            if(res.ok){
                displayConfirmNotif()
                console.log('Displaying confirm notif',res)
            }
           
        })
        .catch(function(err){
            console.log('Error occured with using serviceWorker to send notification',err)
        })
    
}


// Displaying confirm notification
function displayConfirmNotif(){
   
    // using serviceWORKER
    if('serviceWoker' in navigator){

        let options = {
            body : 'You\'ve successfully opt-in for notification',
            icon : '/src/images/icons/app-icon-96x96.png',
            // title : 'Enable Notification'
            image : '/src/images/sf-boat',
            vibration : [100,20,250],
            lang : 'en-US',
            badge : '/src/images/icons/app-icon-96x96.png',
            tag : 'confirm-notification',
            renotify : true,
            action : [
                {action: 'confirm', title:'Yes',icon:'/src/images/icons/app-icon-96x96.png'},
                {action: 'cancel', title:'Cancel',icon:'/src/images/icons/app-icon-96x96.png'}
            ]
        }

        navigator.serviceWorker.ready
            .then(function(swreg){
                swreg.showNotification(`Succesfully opt-in .... ${options}`);
                console.log('[Service worker]...showing notifications')
            })
    }
    // new Notification = ('Succesfully opt-in....',options);  // Using notification without a serviceWorker
}

































































































































































//Playing with fetch and promises

// fetch
// fetch('https://httpbin.org/ip')
//     .then(function(response){
//         return response.json();
//     })
//         .then(function(data){
//             console.log(data)
//         })
//     .catch(function(err){
//         console.log(err)
//     })


// fetch('https://httpbin.org/post',{
//     method:"POST",
//     headers:{
//         "Content-Type":"application/json",
//         "Accept":"application/json"
//     },  
//     body:JSON.stringify({message:'here is a data to be sent!'})
// }) 
//     .then(function(res){
//         console.log(res);
//     })
//     .catch(function(err){
//         console.log(err);
//     })
    

// //Using Ajax
// let xhr =  new XMLHttpRequest()
// xhr.open('GET','Https://httpbin.org/ip',true);

// xhr.onload = (response)=>{
//     if(xhr.readyState === 4 && xhr.status === 200){
//         console.log(xhr.responseText);
//     }
// }

// xhr.onerror = (err)=>{
// console.log(err)
// }

// xhr.send()










// //Promise
// let promise = new Promise((resolve,reject)=>{
//     setTimeout(() => {
//         // resolve('Executing after timer is done');
//         reject({code:400,message:'Error occured'})
//     }, 3000);
// })

// promise.then(function(text){
//     return text;
// }).then(function(newText){
//     console.log(newText)
// }).catch(function(err){
//     console.log(err.code,err.message)
// })



// console.log('Before timer is done!');

// // Get 
// let GETpromise  = new Promise((resolve,reject)=>{
//     setTimeout(() => {
//         resolve('gttps://swapi.co/people/1');
//     }, 2000);
// })
//   .then(url=>{
//       return fetch(url)
//   })
//   .then(response=>{
//       return response.json();
//   })
//   .then(data=>{
//       console.log(data.name)
//   })

// // Put
// let Putpromise =  new Promise((resolve,reject)=>{
//     setTimeout(() => {
//         resolve('https://swapi.co/people/1');
//     }, 2000);
// })
// .then(url=>{
//     return fetch(url,{
//         method:"PUT",
//         headers:{
//             "Content-Type":"application/json",
//             "Accept":"application/json"
//         },
//         mode:"cors",
//         body: JSON.stringify({people:{name:"Bill sANDS", age:22}})
//     })
// })
// .then(response=>{
//     return response.json();
// })
// .then(data=>{
//     console.log(data.json.name,data.json.age);
// })
// .catch(err=>{
//     console.log(err);
// })