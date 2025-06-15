// /api/play.js
import axios from 'axios';
import ytSearch from 'yt-search';
import ytdl from 'ytdl-core';

export default async function handler(req, res) {
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

    // Get download URL (using ytdl-core)
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

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
        download_url: format.url
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: "YourName",
      status: false,
      message: "An error occurred."
    });
  }
}
