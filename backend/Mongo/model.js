const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
    // _id: {type: string},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    subscription: { type: Object } // Subscription data for push notifications
  });


const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Käyttäjän id, jolta tilaus tehdään
    subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Käyttäjän id, joka tilaa notifikaatioita
    subscription: { type: Object }
  });

  // Exports
  exports.User = mongoose.model('User', userSchema);
  exports.Subscription = mongoose.model('Subscription', subscriptionSchema)