const prisma = require('prisma');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadArtwork = async(req, res) => {
    try {
        const {title, description} = req.body;
        const imageBuffer = req.file.buffer;

        const uploadResponse = await imagekit.upload({
            file: imageBuffer,
            fileName: 'unique-file-name.jpg',
          });

        const imageUrl = uploadResponse.url;
        
        const artwork = await prisma.artwork.create({
            data: {
              title,
              description,
              imageUrl,
            },
          });
          res.status(201).json({message: 'Artwork berhasil diupload', artwork});

    } catch (err) {
        console.error(err);
        res.status(500).json({err: 'Terjadi kesalahan saat mengupload artwork'});
    }
};

const listArtworks = async(req, res) => {
    try {
        const artworks = await prisma.artwork.findMany();
        res.status(200).json(artworks);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: 'Terjadi kesalahan saat mengambil daftar artwork'});
      }
};

const getArtworkDetail = async(req, res) => {
    try {
        const artworkId = parseInt(req.params.id);
        const artwork = await prisma.artwork.findUnique({
          where: {id: artworkId},
        });

        if (artwork) {
            res.status(200).json(artwork);
        }  else {
            res.status(404).json({err: 'Artwork tidak ditemukan'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({err: 'Terjadi kesalahan saat mengambil detail'});
    }
};

const deleteArtwork = async(req, res) => {
    try {
        const artworkId = parseInt(req.params.id);
        const artwork = await prisma.artwork.findUnique({
          where: { id: artworkId },
        });

        if (artwork) {
            await prisma.artwork.delete({
              where: {id: artworkId},
            });
      
            res.status(200).json({message: 'Artwork berhasil dihapus'});
        } else {
            res.status(404).json({err: 'Artwork tidak ditemukan'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({err: 'Terjadi kesalahan saat menghapus Artwork'});
    }
};

const editArtwork = async(req, res) => {
    try {
        const artworkId = parseInt(req.params.id);
        const {title, description} = req.body;
    
        const artwork = await prisma.artwork.findUnique({
          where: {id: artworkId},
        });
        if (artwork) {
            const updateArtwork = await prisma.artwork.update({
              where: {id: artworkId},
              data: {
                title,
                description,
              },
            });
            res.status(200).json({message: 'Artwork berhasil diperbarui', artwork: updateArtwork});
        } else {
            res.status(404).json({err: 'Artwork tidak ditemukan'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({err: 'Terjadi kesalahan saat memperbarui'});
    }
};

module.exports = {
    uploadArtwork,
    listArtworks,
    getArtworkDetail,
    deleteArtwork,
    editArtwork,
};