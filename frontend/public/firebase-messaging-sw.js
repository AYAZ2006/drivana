importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js')
firebase.initializeApp({
  apiKey: "AIzaSyBywvZXmRgElCJ-XcQ3j1VcU0Q0x7jYgpI",
  authDomain: "drivana-5c7e3.firebaseapp.com",
  projectId: "drivana-5c7e3",
  storageBucket: "drivana-5c7e3.firebasestorage.app",
  messagingSenderId: "436800809575",
  appId: "1:436800809575:web:d61f8cd18f2a8e0eb4c2c2",
  measurementId: "G-QPEC4BTTWH",
})
const messaging=firebase.messaging()
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
})
