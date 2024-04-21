const axios = require('axios');
// check if JSON server response in localhost:3000 (make sure that another server is not running in localhost:3000)
async function checkJsonServerStatus() {
    try {
      const response = await axios.get('http://localhost:3000');
      if (response.status === 200 && response.data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking JSON Server status:', error);
    }
  }
  module.exports = { checkJsonServerStatus };