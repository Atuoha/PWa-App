

var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var titleInput = document.querySelector('#title');
var locationInput = document.querySelector('#location')
var videoPlayer =  document.querySelector('#player');
var canvasElement = document.querySelector('#canvas');
var captureBtn = document.querySelector('#capture-btn');
var imagePicker =  document.querySelector('#image-picker');
var locationBtn = document.querySelector('#location-btn');
var locationSpinner = document.querySelector('#location-loader');
var imagePickerDIV = document.querySelector('#pick-imageDIV');
var form = document.querySelector('form');
var fetchedLocation = {lat:0,lng:0};
var manualLocation = document.querySelector('#manual-location');
var picture;

// get Location
locationBtn.addEventListener('click',function(event){
  event.preventDefault();
  console.log('Triggering Get Current Location');

    if(!('geolocation' in navigator)){
      return;
    }

    locationBtn.style.display = 'none';
    locationSpinner.style.display = 'block';
    imagePicker.style.display = 'none';

    let sawAlert = false;

    navigator.geolocation.getCurrentPosition(function(position){
      locationBtn.style.display = 'none';
      locationSpinner.style.display = 'none';
      imagePicker.style.display = 'none';
      imagePickerDIV.style.display = 'none';
      fetchedLocation = {lat:position.coords.latitude, lng:position.coords.longitude};
      locationInput.value = 'In Port Harcourt';
      manualLocation.classList.add('is-focused')
    }, function(err){
      console.log(`Error Occured due to ${err}`);
      locationBtn.style.display = 'inline';
      locationSpinner.style.display = 'none';
      if(!sawAlert){
        sawAlert = true;
      alert(`Couldn't fetch location. Enter Manually!`);
      }
      fetchedLocation = {lat:0,lng:0};
    }, {timeout: 7000})
})

function initGETLocation(){
  if(!('geolocation' in navigator)){
    locationBtn.style.display = 'none';
  }
}

// Live Camera Function
function initMediaCapture() {
  if(!('mediaDevices' in navigator)){
    navigator.mediaDevices = {};
  }

  if(!('getUserMedia' in navigator.mediaDevices)){
    navigator.mediaDevices.getUserMedia = function(constraints){
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if(!getUserMedia){
        return Promise.reject(new Error('getUserMedia can not be implemented'));
      }

      return new Promise(function(resolve,reject){
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }

  navigator.mediaDevices.getUserMedia({video:true,audio:true})
    .then(function(stream){
      videoPlayer.srcObject = stream;
      videoPlayer.style.display = 'block';
      imagePicker.style.display = 'none';
      locationSpinner.style.display = 'none';
      imagePickerDIV.style.display = 'none';
      canvasElement.style.display = 'none';

      
    })
    .catch(function(err){
      imagePickerDIV.style.display = 'block';
      captureBtn.style.display = 'none';
      videoPlayer.style.display = 'none';
      canvasElement.style.display = 'none';
      console.log(`Live Image Capture can't show. Error is caused due to ${err}`);
    })
}

// capturing image
captureBtn.addEventListener('click',function(event){
  event.preventDefault();
  console.log('Triggering Image Capture')

  canvasElement.style.display = 'block';
  videoPlayer.style.display = 'none';
  captureBtn.style.display = 'none';

  var context =  canvasElement.getContext('2d');
  context.drawImage(videoPlayer, 0, 0 , canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width))

  videoPlayer.srcObject.getVideoTracks().forEach(function(track){
    track.stop()
  });

  let picture = dataURLtoBlob(canvasElement.toDataURL());
})


imagePicker.addEventListener('change',function(event){
  picture = event.target.files[0];
})

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  captureBtn.style.display = 'inline';


  initMediaCapture();
  initGETLocation()  

  // setTimeout(function(){
    // createPostArea.style.transform = 'translateY(0vh)';
  // },1);

  // pREventing default homescreen banner
  if(defferedOption){
    defferedOption.prompt();

    defferedOption.userChoice
    .then(function(choiceResult){
      console.log(choiceResult.outcome);
      if(choiceResult.outcome === 'dismissed'){
        console.log('User didn\'t allow install on homescreen');
      }else{
        console.log('User allowed install on homescreen');
      }
    });

    defferedOption = null;
  }



  // Unregister service worker
  // if('serviceWorker' in navigator){
  //   navigator.serviceWorker.getRegistrations()
  //    .then(registeration=>{
  //       for (let i = 0; i < registeration.length; i++) {
  //          registration[i].unregister()       
  //       }
  //    })
  // }

}

function closeCreatePostModal() {
  // createPostArea.style.transform = 'translateY(100vh)';
  createPostArea.style.display = 'none';
  videoPlayer.style.display = 'none';
  canvasElement.style.display = 'none';
  imagePickerDIV.style.display = 'none';
  locationBtn.style.display = 'inline';
  locationSpinner.style.display = 'none';
  if(videoPlayer.srcObject){
    videoPlayer.srcObject.getVideoTracks().forEach(function(track){
      track.stop();
    })
  }

  
  
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function clearCards()
{
  while(sharedMomentsArea.hasChildNodes()){
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}


// Allows you to cache assets on click demand
// function saveBtnFn(event){
//   console.log('Clicked btn',event);
//   if('Cache' in window){
//     caches.open('user-cache')
//      .then(cache=>{
//        cache.addAll([
//          'https://httpbin.org/get',
//          '/src/images/sf-boat.jpg'
//        ])
//      })
//   }
// }

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url('+ data.image +')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';
  // let cardbutton = document.createElement('button');
  // cardbutton.textContent = 'Save';
  // cardbutton.className = 'btn btn red ';
  // cardbutton.style.margin = '5px';
  // cardbutton.style.background 
  // cardbutton.addEventListener('click',saveBtnFn);
  // cardSupportingText.appendChild(cardbutton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUi(data){
  clearCards();
  for (let i = 0; i < data.length; i++) {
      createCard(data[i])    
  }
}

let url = 'https://atutechs-pwa.firebaseio.com/Posts';
let NetworkReceiveddata = false;

fetch(url)
  .then(res=>{
    return res.json()
  })
  .then(data=>{
    console.log('Fetching from web', data)
    NetworkReceiveddata = true
    let dataArray = [];
        for( let key in data){
          dataArray.push(data[key]);
        }
        updateUi(dataArray)
  })



// using  cache with network 
// if('caches' in window){
//   caches.match(url)
//     .then(res=>{
//       if(res){
//         return res.json();
//       }
//         })
//      .then(data=>{
//        if(NetworkReceiveddata !== true){
//         console.log('Fetching from cache', data)
//         let dataArray = [];
//         for( let key in data){
//           dataArray.push(data[key]);
//         }
//         updateUi(dataArray)
//        }      
//      })
// }

// using indexDB 
if('indexDB' in window){
  readAllData('posts')
    .then(function(data){
      if(!NetworkReceiveddata){
        console.log('from indexDB(cache)', data)
        updateUi(data);
      }
    })
} 



// sendData Function
function sendData(){
  let id = new Date().toISOString();
  let postData = new FormData();
  postData.append('id',id);
  postData.append('title', titleInput.value);  
  postData.append('location',locationInput.value); 
  postData.append('rawLocationLat', fetchedLocation.lat);
  postData.append('rawLocationLng', fetchedLocation.lng); 
  postData.append('picture',picture, id + '.png'); 



  fetch('https://atutechs-pwa.firebaseio.com/Posts',{
    method: "POST",
   
    body:postData

  })
  .then(res=>{
    console.log('Sent to firebase',res);
    updateUi(res)
  })
}




// Form Function
form.addEventListener('submit',function(e){
  e.preventDefault();

  if(titleInput.value.trim() === '' || locationInput.value.trim() === ''){
    alert('You have to enter data');
    return false;
  }

  closeCreatePostModal();

  // Synchronization
  if('serviceWorker' in navigator && 'SyncManager' in window){
    navigator.serviceWorker.ready
      .then(sw=>{
        var post = {
          id: new Date().toISOString(),
          title: titleInput.value,
          location: locationInput.value,
          picture: picture,
          rawLocation:fetchedLocation

          }
        })
        writeData('sync-posts','posts')
          .then(function(){
            return sw.sync.register('sync-new-posts');
          })
          .then(function(){
            console.log('sending to indexDB; no-online medium! Synching...');
            var snackbar = document.querySelector('#confirmation-toast');
            var data = {message: 'Post is ready for Syncing...'};
            snackbar.MaterialSnackbar.showSnackbar(data);
          })
          .catch(err=>{
            console.log(err)
          })

    }else{
      sendData()
    }   
})