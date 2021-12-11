//imports needed for this function
require('dotenv').config();
const process = require( 'process' );
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const recursive = require('recursive-fs');
const basePathConverter = require('base-path-converter');
const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;

const pinDirectoryToIPFS = (src) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
    recursive.readdirr(src, function (err, dirs, files) {
        let data = new FormData();
        files.forEach((file) => {
            //for each file stream, we need to include the correct relative file path
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(src, file)
            });
        });

        return axios
            .post(url, data, {
                maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_API_SECRET
                }
            })
            .then(function (response) {
                var data = response.data
                console.log(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    });
};

pinDirectoryToIPFS(process.argv[2]);