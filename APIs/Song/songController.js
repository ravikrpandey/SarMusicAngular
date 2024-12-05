const db = require("../../IndexFiles/modelsIndex")
const tbl_song = db.song;
const tbl_album = db.album
const ytdl = require('ytdl-core');
const { exec } = require('child_process');
const { where } = require("sequelize");
const {saveFileAndGetNameByBase64} = require('../services/upload-files/service')
const { Sequelize } = require('sequelize'); // Ensure Sequelize is imported
//=============== create song  ======//

exports.createSong = async (req, res) => {
    try {
        const createdSongs = [];
        for (let songData of req.body) {
            const { albumId, albumName, artistId, artistName, songTitle, duration, songUrl, songFile, releaseDate, genre, albumCardUrl, songCardUrl } = songData;

            let filePath = songUrl;
            if (songFile) {
                filePath = await saveFileAndGetNameByBase64(songFile, songTitle);
            }

            // Save song data to the database
            const createdSong = await tbl_song.create({
                albumId,
                albumName,
                artistId,
                artistName,
                songTitle,
                duration,
                songUrl: filePath,
                releaseDate,
                genre,
                albumCardUrl,
                songCardUrl
            });
            createdSongs.push(createdSong);
        }

        return res.status(200).send({ code: 200, message: 'Songs Created Successfully', data: createdSongs });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
    }
};

//================ getAll song =============//

exports.getAllSong = async (req, res) => {
    try {
        const allData = await tbl_song.findAll({
            where: {
                isDeleted: false
            }
        })
        return res.status(200).send({ code: 200, message: "all song fetched succesfully", data: allData });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "internal server error" })
    }
}

//================ get song by id ===============//

exports.getSongById = async (req, res) => {
    try {
        const { id } = req.params;
        const getData = await tbl_song.findOne({
            where: {
                songId: id,
                isDeleted: false
            }
        })
        return res.status(200).send({ code: 200, message: "song fetched succesfully", data: getData })
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "internal server error" })
    }
}

//================= update song ==========//

exports.updateSong = async (req, res) => {
    try {
        const { id } = req.params;
        const { albumId, albumName, artistId, artistName, songTitle, duration, songUrl, songFile, releaseDate, genre , songCardUrl} = req.body;

        const song = await tbl_song.findOne({
            where: {
                songId: id
            }
        });

        if (!song) {
            return res.status(422).send({ code: 422, message: "Invalid data" });
        }

        let filePath = songUrl;

        if (songFile) {
            filePath = await saveFileAndGetNameByBase64(songFile, songTitle);
        }

        const updatedSong = await tbl_song.update(
            {
                albumId,
                albumName,
                artistId,
                artistName,
                songTitle,
                duration,
                songUrl: filePath,
                releaseDate,
                genre,
                songCardUrl
            },
            {
                where: {
                    songId: id
                }
            }
        );

        return res.status(200).send({ code: 200, message: "Song updated successfully", data: updatedSong });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal server error" });
    }
};


//============ delete ==========//

exports.deleteSong = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await tbl_song.findOne({
            where: {
                songId: id
            }
        })
        if (data) {
            const updateData = await tbl_song.update({
                isDeleted: true
            },
                {
                    where: {
                        songId: id
                    }
                })
                return res.status(200).send({ code: 200, message: "Soft delete completed successfully", data: updateData });
        } else {
            return res.status(422).send({ code: 422, message: "invalid data" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "internal server error" });
    }
}

//================ getSonsByAlbumId ===========//



exports.getSongsByAlbumId = async (req, res) => {
    try {
        const { albumId } = req.params;

        const data = await tbl_song.findAll({
            where: {
                albumId: albumId,
                isDeleted: false
            },
            attributes: ['songTitle', 'songId', 'songUrl', 'artistName'],
            order: Sequelize.fn('RAND')
        });

        return res.status(200).send({ 
            code: 200, 
            message: "Songs fetched successfully by album ID", 
            data: data 
        });
    } catch (error) {
        return res.status(500).send({ 
            code: 500, 
            message: error.message || "Internal server error" 
        });
    }
};


exports.getSongsByArtistId = async (req, res) => {
    try {
        const { artistId } = req.params;
        const data = await tbl_song.findAll({
            where: {
                artistId: artistId,
                isDeleted: false
            }, attribute: ['songTitle', 'songId', 'songUrl', 'artistName']
        })
        return res.status(200).send({ code: 200, message: "song is fetched successfully", data: data })
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "internal server error" });
    }
};


//============== getSOngUrlByYoutubeLink===============

exports.getSongUrlByYoutubeLink = async (req, res) => {
    try {


        async function getDirectAudioUrl(youtubeUrl) {
            return new Promise((resolve, reject) => {
                const command = `youtube-dl -g -f bestaudio "${youtubeUrl}"`;
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (stderr) {
                        reject(new Error(stderr));
                        return;
                    }
                    const audioUrl = stdout.trim();
                    resolve(audioUrl);
                });
            });
        }

        // Example usage
        const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        getDirectAudioUrl(youtubeUrl)
            .then(audioUrl => {
                console.log('Direct audio URL:', audioUrl);
            })
            .catch(error => {
                console.error('Error:', error.message);
            });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ code: 500, message: 'Failed to get audio URL' });
    }
};

// async function getDirectAudioUrl(youtubeUrl) {
//     return new Promise((resolve, reject) => {
//         const videoId = ytdl.getURLVideoID(youtubeUrl);
//         ytdl.getInfo(videoId, (err, info) => {
//             if (err) {
//                 console.error('Error fetching video info:', err);
//                 reject(err);
//                 return;
//             }

//             const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
//             if (!audioFormat) {
//                 reject(new Error('No audio stream found'));
//                 return;
//             }

//             resolve(audioFormat.url);
//         });
//     });
// }


exports.masterSearchForSongOrAlbum = async (req, res) => {
    try {
        const searchKey = req.params.searchKey;

        async function searchSongs(searchTerm) {
            const query = `
                SELECT * FROM songs
                WHERE songTitle LIKE ?
                   OR artistName LIKE ?
                   OR albumName LIKE ?
                   OR genre LIKE ?`;
            const likeSearchTerm = `%${searchTerm}%`;
            const data = await db.sequelize.query(query, {
                replacements: [likeSearchTerm, likeSearchTerm, likeSearchTerm, likeSearchTerm],
                type: db.sequelize.QueryTypes.SELECT
            });
            return data;
        }

        if (searchKey) {
            const data = await searchSongs(searchKey);
            return res.status(200).send({ code: 200, message: 'Searched result', data });
        } else {
            return res.status(400).json({ code: 400, message: 'No search key provided' });
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ code: 500, message: 'Failed to retrieve search results' });
    }
};

