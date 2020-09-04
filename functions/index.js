let functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
let functions = require('firebase-functions');
let admin =  require('firebase-admin');
let cors = require('cors')({origin: true})
let webpush = require('web-push');
let formidable = require('formidable');
let fs =  require('fs');
let UUID = require('uuid-v4');


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

let serviceKey = require('./atutechs-pwa.json')

let gcconfig = {
  projectId = 'atutechs-pwa',  // GET THIS FROM PROJECT SETTING IN FIREBASE
  keyFileName = 'atutechs-pwa.json'

}

let gcs = require('@google-cloud/storage')(gcconfig);

admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
    databaseURL: 'https://atutechs-pwa.firebaseio.com/'
})

exports.storePostData = functions.https.onRequest(function(request,response){
  cors(request, response, function(){
  let uuid = new UUID();
  let formData = new formidable().IncomingForm();
  formData.parse(request, function(err, fields, files){
    fs.rename(files.file.path, '/tmp' + files.file.name )
    let bucket = gcs.bucket('gs://atutechs-pwa.appspot.com/');
    bucket.upload('/tmp' + files.file.name, {
      uploadType: 'media',
      metadata:{
        metadata:{
          contentType: files.file.type,
          firebaseStorageDownloadTokens = uuid;
        }
      }
    },function(err,file){
      if(!err){
        
         admin.database.ref('Posts').push({
        id: fields.id,
        title: fields.title,
        location: fields.location,
        rawLocation:{
          lat: fields.rawLocationLat,
          lng: fields.rawLocationLng
        },
        image: 'https://firebasestorage.googleapis.com/v0/b/' + bucket.name + '/o/' + encodeURIComponent(file.name) + '?alt=media&token=' + uuid;
        })
        .then(function(){
            webpush.setVapidDetails('mailto:atuohainitiatives@gmail.com','BMDPGPn3JLNE5T3dlnyS905VuZ9RWU34nfQAQVYH21HGt_FAjPekLdZjc0JuMzelv-tpVY6VTQqz5m6hF-m9vWE','Ps_ZBo2vt73YSEkO_Dm1ffNwgPIJWFoKlQQoVa9psgE') // pass the public and private keys as the second and third parameters respectively
            return admin.database.ref('Subscriptions').once('value');
        })
        .then(function(subscription){
          subscription.forEach(function(sub){
            var pushConfig = {
              endpoint: sub.val().endpoint,
              keys:{
                auth: sub.val().keys.auth,
                p256dh = sub.val().keys.p256dh
              }
            }
            webpush.sendNotification(pushConfig, JSON.stringify({
              title:'New Post',
              content:'New Post Added!',
              openUrl: '/help'
            }))
            .catch(function(err){
              console.log(`Error Occured with sending notification ${err}`);
            })
          });
          response.status(201).json({message: 'Data store', id: fields.id})
        })
        .catch(function(err){
            response.status(500).json({Error: err})
            console.log('Error occured',err)
        })
      }else{
        console.log('Error occured!!',err)
      }
    })

  });
  
  })
});
