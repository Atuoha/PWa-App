if(!self.define){const e=e=>{"require"!==e&&(e+=".js");
let i=Promise.resolve();

return s[e]||(i=new Promise(async i=>{if("document"in self){const s=document.createElement("script");
s.src=e,document.head.appendChild(s),s.onload=i}else importScripts(e),i()})),i.then(()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);
return s[e]})},i=(i,s)=>{Promise.all(i.map(e)).then(e=>s(1===e.length?e[0]:e))},s={require:Promise.resolve(i)};

self.define=(i,c,r)=>{s[i]||(s[i]=Promise.resolve().then(()=>{let s={};
const n={uri:location.origin+i.slice(1)};return Promise.all(c.map(i=>{switch(i){case"exports":return s;
case"module":return n;default:return e(i)}})).then(e=>{const i=r(...e);
    return s.default||(s.default=i),s})}))}}define("./service-worker.js",["./workbox-1bbb3e0e"],(function(e){"use strict";
    
self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([
    {url:"404.html",revision:"0a27a4163254fc8fce870c8cc3a3f94f"},
    {url:"favicon.ico",revision:"2cab47d9e04d664d93c8d91aec59e812"},
    {url:"help/index.html",revision:"6c26929040e190d816ff75634d5fe952"},
    {url:"index.html",revision:"a4ab44d32d10fc7f2f4185029cb2fb5c"},
    {url:"manifest.json",revision:"4c45db62058540a77b6c2b58ff1d87b2"},
    {url:"offline.html",revision:"af1f35c5b9df04afe41992466b1d0c98"},
    {url:"src/css/app.css",revision:"82562fd148286a787a74f2efbd5621b7"},
    {url:"src/css/feed.css",revision:"b28b05c0c54207787aec6b51ab76270e"},
    {url:"src/css/help.css",revision:"1c6d81b27c9d423bece9869b07a7bd73"},
    {url:"src/css/materialize.min.css",revision:"df8ee5622d9d736da06a6b0e7afdef55"},
    {url:"src/images/icons/app-icon-144x144.png",revision:"83011e228238e66949f0aa0f28f128ef"},
    {url:"src/images/icons/app-icon-192x192.png",revision:"f927cb7f94b4104142dd6e65dcb600c1"},
    {url:"src/images/icons/app-icon-256x256.png",revision:"86c18ed2761e15cd082afb9a86f9093d"},
    {url:"src/images/icons/app-icon-384x384.png",revision:"fbb29bd136322381cc69165fd094ac41"},
    {url:"src/images/icons/app-icon-48x48.png",revision:"45eb5bd6e938c31cb371481b4719eb14"},
    {url:"src/images/icons/app-icon-512x512.png",revision:"d42d62ccce4170072b28e4ae03a8d8d6"},
    {url:"src/images/icons/app-icon-96x96.png",revision:"56420472b13ab9ea107f3b6046b0a824"},
    {url:"src/images/icons/apple-icon-114x114.png",revision:"74061872747d33e4e9f202bdefef8f03"},
    {url:"src/images/icons/apple-icon-120x120.png",revision:"abd1cfb1a51ebe8cddbb9ada65cde578"},
    {url:"src/images/icons/apple-icon-144x144.png",revision:"b4b4f7ced5a981dcd18cb2dc9c2b215a"},
    {url:"src/images/icons/apple-icon-152x152.png",revision:"841f96b69f9f74931d925afb3f64a9c2"},
    {url:"src/images/icons/apple-icon-180x180.png",revision:"2e5e6e6f2685236ab6b0c59b0faebab5"},
    {url:"src/images/icons/apple-icon-57x57.png",revision:"cc93af251fd66d09b099e90bfc0427a8"},
    {url:"src/images/icons/apple-icon-60x60.png",revision:"18b745d372987b94d72febb4d7b3fd70"},
    {url:"src/images/icons/apple-icon-72x72.png",revision:"b650bbe358908a2b217a0087011266b5"},
    {url:"src/images/icons/apple-icon-76x76.png",revision:"bf10706510089815f7bacee1f438291c"},
    {url:"src/images/main-image-lg.jpg",revision:"31b19bffae4ea13ca0f2178ddb639403"},
    {url:"src/images/main-image-sm.jpg",revision:"c6bb733c2f39c60e3c139f814d2d14bb"},
    {url:"src/images/main-image.jpg",revision:"5c66d091b0dc200e8e89e56c589821fb"},
    {url:"src/images/sf-boat.jpg",revision:"0f282d64b0fb306daf12050e812d6a19"},
    {url:"src/js/app.js",revision:"6d2e245e8857b7e5b58b7d875f0b8344"},
    {url:"src/js/feed.js",revision:"b29f3ac5400e7e486e983e29c98688d6"},
    {url:"src/js/fetch.js",revision:"6b82fbb55ae19be4935964ae8c338e92"},
    {url:"src/js/idb.js",revision:"017ced36d82bea1e08b08393361e354d"},
    {url:"src/js/material.min.js",revision:"713af0c6ce93dbbce2f00bf0a98d0541"},
    {url:"src/js/promise.js",revision:"10c2238dcd105eb23f703ee53067417f"},
    {url:"src/js/utility.js",revision:"d0df84df6439e0c3cf466a61e93c616f"},
    {url:"sw.js",revision:"9a4ffc20f56de9ed349f24adc3d30512"},
    {url:"testing.js",revision:"8c8aab6c4a876ccb21d86691cc6e6a05"}],{})}));
//# sourceMappingURL=service-worker.js.map

