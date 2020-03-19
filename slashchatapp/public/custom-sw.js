self.addEventListener("push", event => {
  const data = event.data.json();
  const { from, message, currentUserImg: icon } = data;
  function UpperCaseFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.substring(1);
  }
  // console.log("New notification");
  const options = {
    body: UpperCaseFirstLetter(message),
    icon,
    vibrate: [200, 100, 200],
    badge: "icon_256.png"
  };
  event.waitUntil(
    self.registration.showNotification(UpperCaseFirstLetter(from), options)
  );
});

self.addEventListener("notificationclick", function(event) {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close();

  event.waitUntil(clients.openWindow("https://slashchatapp.firebaseapp.com/"));
});
