self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
  //console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  //console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", function (event) {

});