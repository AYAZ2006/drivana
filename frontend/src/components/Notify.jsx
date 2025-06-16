import React from 'react';

function Notify() {
  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Simple Notification', {
        body: 'Native Web Notification is working!',
        icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Simple Notification', {
            body: 'Thanks for granting permission!',
            icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png',
          });
        } else {
          alert('Notification permission was denied.');
        }
      });
    } else {
      alert('Notification permission was denied.');
    }
  };

  return (
    <div style={{ margin: '100px' }}>
      <button onClick={showNotification}>Show Native Notification</button>
    </div>
  );
}

export default Notify;
