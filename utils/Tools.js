const linkToCoordinates = (link) => {
  try {
    latL = link.slice(50, 73).split('%2C')[0];
    lonL = link.slice(50, 73).split('%2C')[1].split('&')[0];
    return {
      lat: latL,
      lon: lonL
    } 
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  linkToCoordinates
}