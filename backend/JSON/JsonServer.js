const axios = require('axios');

const JSONgetUsers = async () => {
    const users = await fetch('http://localhost:3000/users').then(response => response.json());

    return users;
}

const JSONgetSubscriptions = async () => {
  const subscriptions = await fetch('http://localhost:3000/subscription').then(response => response.json());

  return subscriptions;
}

const JSONregistery = async (newUser) => {
      // Lähetä POST-pyyntö JSON-serverille tallentamaan käyttäjän tiedot
      await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

  };
  
const JSONuser = async (email) => {
       // Haetaan käyttäjä JSON-serveristä
       const users = await JSONgetUsers();
       const user = users.find(user => user.email === email);
    
       return user;
}

const JSONsubscribtionByUserId =async (userId) => {
  const subscription = await fetch(`http://localhost:3000/subscription?userId=${userId}`).then(response => response.json());

  return subscription;
}

const JSONsubscription = async (userId, subscriberId, sub) => {
      const subscriptions = await JSONgetSubscriptions();

      // Etsi vastaava tilaus
      const foundSubscription = subscriptions.find(sub => sub.userId === userId && sub.subscriberId === subscriberId && sub.subscription === subscription);
      
      return foundSubscription;
}

const JSONnewSubscription = async (newSubscription) => {
    await fetch('http://localhost:3000/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSubscription)
    });
}

const JSONunsubscribe = async (userId) => {
  const subscription = await JSONsubscribtionByUserId(userId);
  console.log("SUBI: ",subscription[0].id)
  await fetch(`http://localhost:3000/subscription/${subscription[0].id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  
}


  



module.exports = { JSONgetUsers, JSONregistery, JSONuser, JSONsubscription, JSONgetSubscriptions, JSONnewSubscription, JSONunsubscribe, JSONsubscribtionByUserId };