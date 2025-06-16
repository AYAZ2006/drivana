import { initializeApp } from "firebase/app";
import { getMessaging,getToken } from "firebase/messaging";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyBywvZXmRgElCJ-XcQ3j1VcU0Q0x7jYgpI",
  authDomain: "drivana-5c7e3.firebaseapp.com",
  projectId: "drivana-5c7e3",
  storageBucket: "drivana-5c7e3.firebasestorage.app",
  messagingSenderId: "436800809575",
  appId: "1:436800809575:web:d61f8cd18f2a8e0eb4c2c2",
  measurementId: "G-QPEC4BTTWH",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const generate = async () => {
  const perm = await Notification.requestPermission();
  console.log("Notification permission:", perm);
  if(perm==="granted"){
    const token=await getToken(messaging,{vapidKey:"BDeCOJ6iKswNyUQkyDBfh5Pyp-1ryn7FLLfikYVTrcuBaCCNi-Br2-BOMmKSejt9zJJN2lyiUGeEtnB8ZkiNEu0"})
    console.log(token)
  }
};

export default function Notify() {
  useEffect(() => {
    generate()
    onMessage(messaging,(payload)=>{
      console.log(payload)
    })
  }, [])

  return <div>Notifications initialized</div>;
}
