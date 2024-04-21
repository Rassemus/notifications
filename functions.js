const GetCookieData = (name) => {
    const cookies = document.cookie.split(';');
    const cookieData = cookies.find(cookie => cookie.trim().startsWith(`${name}=`));
     if (cookieData) {
         const userData = cookieData.split('=')[1];
         return userData;
     }
    return null;
  };

  const saveToLocalStorage = (value) => {
    const subscriptions = getSubscriptionsFromLocalStorage();
    const existingSubscription = subscriptions.find(existing => existing === value);
    if (!existingSubscription) {
      const timestamp = Date.now(); // Hae nykyinen aikaleima
      const key = `subscription_${timestamp}`; // Luo uniikki avain
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  // Hae tallennetut tilaukset välimuistista
    function getSubscriptionsFromLocalStorage() {
      const subscriptions = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('subscription_')) {
          const subscription = JSON.parse(localStorage.getItem(key));
          subscriptions.push(subscription);
        }
      }
      
      return subscriptions;
    }

  const isOnline = () => {
    if (!navigator.onLine) {
        return false; // if offline return false
      } else {
        return true; // if online return true
      }
  }

  async function updateButton(isSubscribed) {
    const button = document.getElementById('subscription-button');

    try {
        if (isSubscribed) {
            button.textContent = 'Unsubscribe';
        } else {
            button.textContent = 'Subscribe';
        }
    } catch (error) {
        console.error('Error updating button:', error);
    }
}