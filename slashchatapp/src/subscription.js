const convertedVapidKey = urlBase64ToUint8Array(
  process.env.REACT_APP_PUBLIC_VAPID_KEY
);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function sendSubscription(subscription, payload) {
  console.log(subscription, payload);
  return fetch(`${process.env.REACT_APP_API_URL}/notifications/subscribe`, {
    method: "POST",
    body: JSON.stringify({ subscription, payload }),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export async function saveTokenOnDatabase(loginUser, subscription) {
  try {
    let response = await fetch(`https://slashchat.herokuapp.com/saveTokenOnDatabase/`, {
      method: "POST",
      body: JSON.stringify({
        loginUser,
        subscription
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    let json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}
export function subscribeUser(loginUser) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(function(registration) {
        if (!registration.pushManager) {
          console.log("Push manager unavailable.");
          return;
        }
        registration.pushManager
          .getSubscription()
          .then(function(existedSubscription) {
            if (existedSubscription === null) {
              console.log("No subscription detected, make a request.");
              registration.pushManager
                .subscribe({
                  applicationServerKey: convertedVapidKey,
                  userVisibleOnly: true
                })
                .then(function(newSubscription) {
                  console.log("New subscription added.");
                  saveTokenOnDatabase(loginUser, newSubscription);
                  // sendSubscription(newSubscription);
                })
                .catch(function(e) {
                  if (Notification.permission !== "granted") {
                    console.log("Permission was not granted.");
                  } else {
                    console.error(
                      "An error ocurred during the subscription process.",
                      e
                    );
                  }
                });
            } else {
              console.log("Existed subscription detected.");
              saveTokenOnDatabase(loginUser, existedSubscription);
              // if (payload) sendSubscription(existedSubscription, payload);
            }
          });
      })
      .catch(function(e) {
        console.error(
          "An error ocurred during Service Worker registration.",
          e
        );
      });
  }
}
