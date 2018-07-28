const Multer = require('multer');
const path = require('path');
const GoogleCloudStorage = require('@google-cloud/storage');
const fs = require('fs-extra');

const { Article } = require('../models');

const multer = Multer({
    limits: {
         fileSize: 3 * 1024 * 1024
    },
    storage: Multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../tmp/uploads'));
        },
        filename(req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

const storage = GoogleCloudStorage({
    projectId: process.env.GCPROJECTID,
    keyFilename: path.join(__dirname, '../config/gcloud.json')
});

const bucket = storage.bucket(process.env.BUCKET_NAME);

const sendUploadToGCS = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    
    //filename
    const gcsname = `${Date.now()}-${req.file.originalname}`;

    // create file link to the google cloud
    const file = bucket.file(gcsname);
    
    const gCloudStream = file.createWriteStream({
        metadata: {
        contentType: req.file.mimetype
        },
        resumable: false
    });
    
    gCloudStream.on('error', async (err) => {
        req.file.cloudStorageError = err;

        //remove file from disk
        await fs.unlink(req.file.path)
        next(err);
    });

    gCloudStream.on('finish', async () => {
        req.file.cloudStorageObject = gcsname;
        file
            // make file public and deliver it to req.file.
            .makePublic()
            .then(() => {
                req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
                next();
            })

            //remove file from disk
            await fs.unlink(req.file.path);
    });

    // create readable from file uploaded and pipe to writable
    fs.createReadStream(req.file.path)
        .pipe(gCloudStream);
};

const deleteOldFileFromGCS = (req, res, next) => {
    // if file doesn't exist do nothing.
    if (delConfirmation(req)) 
        return next();
    
    Article.findById(req.params.id)
        .then(article => {
            bucket.file(article.coverPicID)
                .delete()
                .then(() => next())
                .catch(err => next(err));
        });
};

// Don't delete if file exist and request method be different of DELETE
const delConfirmation = req => !req.file && req.method != 'DELETE';

const getPublicUrl = (filename) => 
  `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${filename}`;

module.exports = {
    multer,
    deleteOldFileFromGCS,
    sendUploadToGCS
};