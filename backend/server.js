
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const { checkJsonServerStatus } = require('./utils.js');
const { JSONgetUsers, JSONregistery, JSONuser, JSONsubscription, JSONgetSubscriptions, JSONnewSubscription, JSONunsubscribe, JSONsubscribtionByUserId} = require('./JSON/JsonServer')

//model
const {User, Subscription} = require('./Mongo/model') 


const app = express();

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Web Push setup
const publicVapidKey = process.env.PUBLIC_VAP_ID_KEY;
const privateVapidKey = process.env.PRIVETE_VAP_ID_KEY;

webpush.setVapidDetails(process.env.MAIL_TO, publicVapidKey, privateVapidKey);

// Middleware for verifying JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/subscriptions', async (req, res) => {
  let subscription;
  try {
    if(checkJsonServerStatus()){
      subscription = await JSONgetSubscriptions();
    }else{
      subscription = await Subscription.find({}, 'userId');
    }
    
    res.json(subscription);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/users', async (req, res) => {
  let users;
  try {
    if(checkJsonServerStatus()){
      users = await JSONgetUsers();
    }else{
       users = await User.find({}, '_id name');
    }
    
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Endpoint for user registration
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });
    //check if the JSON server is being used
    if(checkJsonServerStatus()){
      JSONregistery(user);
    }else{
      await user.save();
    }
    
    res.status(201).send('User registered successfully');
  } catch (error){
    console.log("ERROR: ", error)
    res.status(500).send('Failed to register user');
  }
});

// Endpoint for user login
app.post('/login', async (req, res) => {
  let user;
  if(checkJsonServerStatus()){
    user = await JSONuser(req.body.email);
  }else{
    user = await User.findOne({ email: req.body.email });  
  }
  
  if (!user) return res.status(400).send('User not found');
  const id = user._id

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
  res.json({ token, id });
});

// Endpoint for sending push notification
app.post('/send-notification', authenticateToken, async (req, res) => {
  const payload = JSON.stringify({ title: req.body.title, message: req.body.message });
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(400).send('User not found');
    const userId = user._id;

    // get subscriber by user id
    const subscribers = await Subscription.find({ userId });
    if (!subscribers) return res.status(400).send('No subscibers');

    subscribers.forEach(async (subscription) => {
      // Send notification to user subscription.subscriberId
      await webpush.sendNotification(subscription.subscription, payload);
    });
    
    res.status(201).send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Failed to send notification');
  }
});

app.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    let user;
    let existingSubscription;
    let newSubscription;

    if(checkJsonServerStatus()){
      user = await JSONuser(req.user.email);
    }else{
      user = await User.findOne({ email: req.user.email });
    }
   
    if (!user) return res.status(400).json({message:'User not found'});

    const subscriberId = user._id.toString();

    // check subscription
    if(checkJsonServerStatus()){
      existingSubscription = await JSONsubscription( userId, subscriberId, subscription );
    }else{
      existingSubscription = await Subscription.findOne({ userId, subscriberId, subscription });
    }

    if (existingSubscription) {
      return res.status(409).json({isSubscribed: true, message: 'Subscription already exists.'});
    }

    // Save new subscription
    if(checkJsonServerStatus()){
      newSubscription = await JSONnewSubscription({ userId, subscriberId, subscription });
    }else{
      newSubscription = new Subscription({ userId, subscriberId, subscription });
      await newSubscription.save();
    }
    
   
    res.status(201).json({isSubscribed: true, message:'Subscribed'});
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({message:'Failed to save subscription'});
  }
});

app.post('/unsubscribe', authenticateToken, async (req, res) => {
  try {
    const {userId} = req.body;
    let subscription;
    // Get subscription
    if(checkJsonServerStatus()){
      subscription = await JSONsubscribtionByUserId(userId);
    }else{
      subscription = await Subscription.findOne({userId});
    }

    if(subscription){
      if(checkJsonServerStatus()){
        await JSONunsubscribe(userId);
      }else{
        await Subscription.deleteOne();
      }
      res.status(200).json({isSubscribed: false, message: 'Unsubscribed'})
    }else{
      res.status(404).json({isSubscribed: null, message:'Subscription not found'});
    }
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({message:'Failed to unsubscribe!'});
  }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
