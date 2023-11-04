const Imagekit = require('imagekit');

const {
    IMAGEKIT_URL_ENDPOINT,
    IMAGEKIT_PUBBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY
} = proccess.env;

module.exports = new Imagekit ({
    publicKey:IMAGEKIT_PUBBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    uerlEndpoint: IMAGEKIT_URL_ENDPOINT
});