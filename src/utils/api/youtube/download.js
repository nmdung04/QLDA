import ytdl from '@distube/ytdl-core';
import { spawn } from 'child_process';
import { PassThrough } from 'stream';

// Import ffmpeg path
let ffmpegPath;
try {
  ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
} catch (error) {
  console.log('FFmpeg not available');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, itag, audioItag, needsFFmpeg, quality } = req.body;

  if (!url || !itag) {
    return res.status(400).json({ error: 'URL and itag are required' });
  }

  try {
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${title}_${quality || 'video'}.mp4`;

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Nếu không cần ffmpeg (360p và thấp hơn - đã có cả video và audio)
    if (!needsFFmpeg) {
      const videoStream = ytdl(url, { quality: itag });
      videoStream.pipe(res);
      
      videoStream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        }
      });
      return;
    }

    // Nếu cần ffmpeg (chất lượng cao hơn 360p)
    if (!audioItag || !ffmpegPath) {
      return res.status(400).json({ 
        error: audioItag ? 'FFmpeg not available for high quality downloads' : 'Audio track required for high quality downloads'
      });
    }

    // Tạo streams cho video và audio
    const videoStream = ytdl(url, { quality: itag });
    const audioStream = ytdl(url, { quality: audioItag });

    // Sử dụng child_process để gọi ffmpeg trực tiếp
    const ffmpegArgs = [
      '-i', 'pipe:3', // Video input từ file descriptor 3
      '-i', 'pipe:4', // Audio input từ file descriptor 4
      '-c:v', 'copy',  // Copy video codec
      '-c:a', 'aac',   // Convert audio to AAC
      '-movflags', 'frag_keyframe+empty_moov', // Streaming flags
      '-f', 'mp4',     // Output format
      'pipe:1'         // Output to stdout
    ];

    const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs, {
      stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe']
    });

    // Pipe video stream to fd 3
    videoStream.pipe(ffmpegProcess.stdio[3]);
    // Pipe audio stream to fd 4
    audioStream.pipe(ffmpegProcess.stdio[4]);
    
    // Pipe ffmpeg output to response
    ffmpegProcess.stdout.pipe(res);

    // Handle errors
    ffmpegProcess.on('error', (error) => {
      console.error('FFmpeg process error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Video processing failed' });
      }
    });

    ffmpegProcess.on('exit', (code, signal) => {
      if (code !== 0) {
        console.error(`FFmpeg exited with code ${code}, signal ${signal}`);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Video processing failed' });
        }
      } else {
        console.log('FFmpeg completed successfully');
      }
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.log('FFmpeg stderr:', data.toString());
    });

    // Handle stream errors
    videoStream.on('error', (error) => {
      console.error('Video stream error:', error);
      ffmpegProcess.kill();
      if (!res.headersSent) {
        res.status(500).json({ error: 'Video stream failed' });
      }
    });

    audioStream.on('error', (error) => {
      console.error('Audio stream error:', error);
      ffmpegProcess.kill();
      if (!res.headersSent) {
        res.status(500).json({ error: 'Audio stream failed' });
      }
    });

    // Handle client disconnect
    req.on('close', () => {
      ffmpegProcess.kill();
    });

  } catch (error) {
    console.error('Error downloading video:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download video: ' + error.message });
    }
  }
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
