const mongoDBCloudURL = (userName, password) => `mongodb+srv://${userName}:${password}@metro-finder.mdxfuc0.mongodb.net/?retryWrites=true&w=majority`; 
const mongoDBLocalURL = () => 'mongodb://localhost:27017/metro-finder';
const metroLinesGetUrl = () => serverLocalUrl+'/api/metro-lines';
const serverLocalUrl = () => 'http://localhost:3000/';
const neshanDistanceURL = (origins, destination, type) => `https://api.neshan.org/v1/distance-matrix?type=${type}&origins=${origins}&destinations=${destination}`;



module.exports = {
  mongoDBCloudURL, 
  mongoDBLocalURL,
  serverLocalUrl,
  metroLinesGetUrl,
  neshanDistanceURL
}