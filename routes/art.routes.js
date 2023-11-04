const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const {uploadArtwork, listArtworks, getArtworkDetail, deleteArtwork, editArtwork} = require('../controllers/art.controllers');

const imagekit = new ImageKit ({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const upload = multer();


//Endpoint untuk mengunggah karya seni
router.post('/upload', upload.single('image'), async(req,res) => {
    try {
        const {title, description} = req.body;
        const imageBuffer = req.file.buffer;

        //Mengupload gambar ke imagekit.io
        const uploadResponse = await imagekit.upload({
            file: imageBuffer,
            fileName: 'unique-file-name.jpg'
        });

        const imageUrl = uploadResponse.url;

        //Menyimpan detail artwork ke dalam basis data
        const artwork = await uploadArtwork(title, description, imageUrl);

        res.status(201).json({message: 'Artwork berhasil diupload', artwork})

    } catch (err){
        console.error(err);
        res.status(500).json({err:'Terjadi kesalahan saat mengupload artwork'});

    }
});

//Endpoint untuk menampilkan daftar karya seni
router.get('/list', async (req, res) =>{
    try{
        const artworks = await listArtworks();

        res.status(200).json(artworks);
    } catch (err) {
        console.error(err);

        res.status(500).json({err: 'Terjadi kesalahan saat mengambil daftar artwork'})

    }
});

//Endpoint untuk melihat detail gambar
router.get('/detail/:id', async(req, res) =>{
    try {
        const artworkId = parseInt(req.params.id);
        const artwork = await getArtworkDetail(artworkId);

        if (artwork) {
            res.status(200).json(artwork);
        } else {
            res.status(404).json({err: 'Artwork tidak ditemukan'});
        } 
    } catch (err) {
        console.error(err);
        res.status(500).jsonn({err: 'Terjadi kesalahan saat mengambil detail'});
    }
});

//Endpoint untuk menghapus gambar
router.delete('/delete/:id', async(req,res) => {
    try {
        const artworkId = parseInt(req.params.id);
        const deletedArtwork = await deleteArtwork(artworkId);

        if (deletedArtwork) {
            res.status(200).json({message: 'Artwork berhasil dihapus'});
        } else {
            res.status(404).json({err: 'Artwork tidak ditemukan'});
        }
    
    } catch (err) {
        console.error(err);
        res.status(500).json({err: 'Terjadi kesalahan saat menghapus Artwork'});
    }
});

//Endpoint untuk mengedit judul dan deskripsi gambar yang telah diupload
router.put('/edit/:id', async(req,res) => {
    try {
        const artworkId = parseInt(req.params.id);
        const{title, description} = req.body;

        const updatedArtwork = await editArtwork(artworkId, title, description);

        if (updatedArtwork) {
            res.status(200).json({message: 'Artwork berhasil diperbarui', artwork: updateArtwork});
        } else {
            res.status(404).json({err: 'Artwork tidak ditemukan'});
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({err: 'Terjadi kesalahan saat memperbarui'});

    }
});

module.exports = router;