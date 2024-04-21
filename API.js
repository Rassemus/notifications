
const getUsers = async () => {
    let subList = await getSubscription();

     fetch('http://localhost:8000/users')
       .then(response => response.json())
       .then(users => {
        const buttonContainer = document.getElementById('buttonContainer');
        const existingButtons = buttonContainer.querySelectorAll('button');


        if(!GetCookieData('token')){
            const message = document.getElementById('subscription-message')
            message.textContent = `You need to log in.`;

            return message;
        }

        users.forEach(user => {
            const userId = user._id;
            const content = document.createElement('div');
            const name = document.createElement('div');

            const isSubscribed = subList.includes(userId); // check if subscribed

            let button;
            if(GetCookieData('user_id') !== userId){
                name.textContent = `${user.name}`;
                button = Array.from(existingButtons).find(btn => btn.dataset.userId === userId);
                if(!button){
                    button = document.createElement('button');
                    button.textContent = isSubscribed ? 'Unsubscribe' : 'Subscribe';
                    button.dataset.userId = userId;

                    button.addEventListener('click', () => {
                        if(isSubscribed){
                            // UNSUBSCRIBE
                            unsubscribe(userId).then(async () => {
                                getUsers(); // Update button text
                            });
                        }else{
                            // SUBSCRIBE
                            subscribe(userId).then(async () => {
                                getUsers(); // Update button 
                            });;
                        }
                    });
                    content.appendChild(name);
                    content.appendChild(button);
                    buttonContainer.appendChild(content);

                }else{
                    button.textContent = isSubscribed ? 'Unsubscribe' : 'Subscribe';
                    //location.reload()
                }
            }
        });
       })
       .catch(error => {
         console.error('Error fetching user IDs:', error);
       });
}

const getSubscription = async () => {
    try {
        const response = await fetch('http://localhost:8000/subscriptions');
        const subscribe = await response.json();
        const subList = subscribe.map(sub => sub.userId);
        return subList;
    } catch (error) {
        console.error('Error fetching subscribtion:', error);
        throw error; // Throw error
    }
}

//Sen notification to subscribers
async function sendNotification() {
    const title = document.getElementById('title').value;
    const message = document.getElementById('message').value;

    if(!GetCookieData('token')){
        alert(`You need to log in.`);
        return;
    }

    if (!title || !message) {
        alert('Please enter both title and message');
        return;
    }

    if (!('serviceWorker' in navigator)) {
        alert('Service Worker is not supported');
        return;
    }

    if (!('PushManager' in window)) {
        alert('Push notifications are not supported');
        return;
    }

    try {
        await fetch('http://localhost:8000/send-notification', {
            method: 'POST',
            body: JSON.stringify({ title, message}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        alert('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
        alert('Failed to send notification');
    }
}

// Subscribe
async function subscribe(userId) {
    const online = isOnline();
    const subscriptionMessage = document.getElementById('subscription-message');

    // Register serviceWorker
    const registration = await navigator.serviceWorker.ready;
    // get pushManager
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BL0U-GOYKolsR9Uajf9bOQQLBMnRHBzT7EcgqWNB09z7R6ULBN7e_VRXE7U21AIMSud1us6iOXqE8Q4RtyweP-E'
    });

    if(online){
        try {
          const response = await fetch('http://localhost:8000/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GetCookieData('token')}`
            },
            body: JSON.stringify({ userId, subscription})
          });

          const data = await response.json()
          if (!response.ok) {
            alert(data.message)
            throw new Error('Failed to subscribe');
          }

        //subscriptionMessage.textContent = `${data.message.toString()}`;
        alert(data.message)
        } catch (error) {
          console.error('Error subscribing:', error);
        }
        
    }else{
        saveToLocalStorage({subscribe: userId});
    }
  }


  async function unsubscribe(userId) {
    const online = isOnline();
    const subscriptionMessage = document.getElementById('subscription-message');

    if(online){
        try {
          const response = await fetch('http://localhost:8000/unsubscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GetCookieData('token')}`
            },
            body: JSON.stringify({userId})
          });

          const data = await response.json()

          if (!response.ok) {
            alert(data.message)
            throw new Error('Failed to unsubscribe');
          }
 
            //subscriptionMessage.textContent = `${data.message.toString()}`;
            alert(data.message)
        } catch (error) {
          console.error('Error unsubscribing:', error);
        }
        
    }else{
        saveToLocalStorage({unsubscribe: userId});
    }
  }