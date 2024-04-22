const axios = require('axios');
// check if JSON server response in localhost:3000 (make sure that another server is not running in localhost:3000)
async function checkJsonServerStatus() {
    try {
      const response = await axios.get('http://localhost:3000');
      if (response.status === 200 && response.data) {
        return true;
      } else {
        return false; // If response is not 200 return false
      }
    } catch (error) {
      // If error return false.
      return false;
    }
  }
  module.exports = { checkJsonServerStatus };