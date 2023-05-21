const request = require('request');

const fetchMyIp = function(callback) {
// use request to fetch IP address from JSON AP
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(msg, null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);

  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    const dBody = JSON.parse(body);
    if (!dBody.success) {
      const message = `Success status was ${dBody.success}. Server message says: ${dBody.message} when fetching for IP ${dBody.ip}`;
      callback(message, null);
      return;
    }
    const { latitude, longitude } = dBody;
    callback(null, { latitude, longitude });
    return;
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching ISS. Response: ${body}`;
      callback(msg, null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
    return;

  });
};

const nextISSTimesForMyLocation = function(callback) {
  // empty for now
 
  fetchMyIp((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};
module.exports = { nextISSTimesForMyLocation };