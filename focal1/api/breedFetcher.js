const request = require('request');
const breedName = process.argv[2];

request(`https://api.thecatapi.com/v1/breeds/search?q=${breedName}`, (error, response, body) => {
  if (error) {
    console.error(error);
  }
  if (response.statusCode !== 200) {
    console.error(error);
  }
  const data = JSON.parse(body);
  console.log(data);
});
