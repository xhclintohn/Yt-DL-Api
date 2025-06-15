const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        creator: "YourName",
        status: false,
        message: "Please provide a search query."
      });
    }

    // Search YouTube
    const searchResults = await ytSearch(query);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      return res.status(404).json({
        creator: "YourName",
        status: false,
        message: "No videos found."
      });
    }

    const video = searchResults.videos[0];
    const videoUrl = `https://youtube.com/watch?v=${video.videoId}`;

    // Get video info
    const info = await ytdl.getInfo(videoUrl);
    const audioFormat = ytdl.chooseFormat(info.formats, { 
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    res.json({
      creator: "YourName",
      status: true,
      result: {
        title: video.title,
        video_url: videoUrl,
        thumbnail: video.thumbnail,
        duration: video.timestamp,
        views: video.views,
        published: video.ago,
        download_url: audioFormat.url
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      creator: "YourName",
      status: false,
      message: "An error occurred while processing your request."
    });
  }
};
