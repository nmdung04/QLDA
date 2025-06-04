// const ytdl = require('@distube/ytdl-core');
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const { PassThrough } = require('stream');

// // Set ffmpeg path
// ffmpeg.setFfmpegPath(ffmpegPath);

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { url, videoItag, audioItag, quality, isDirectFormat, itag } = req.body;

//   if (!url) {
//     return res.status(400).json({ error: 'URL and quality are required' });
//   }

//   try {
//     if (!ytdl.validateURL(url)) {
//       return res.status(400).json({ error: 'Invalid YouTube URL' });
//     }

//     const info = await ytdl.getInfo(url);
//     const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
//     const filename = `${title}_${quality}.mp4`;

//     // Set headers for file download
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//     res.setHeader('Content-Type', 'video/mp4');

//     // Nếu là direct format (đã có cả video và audio)
//     if (isDirectFormat) {
//       const videoStream = ytdl(url, { quality: itag });
//       videoStream.pipe(res);
      
//       videoStream.on('error', (error) => {
//         console.error('Stream error:', error);
//         if (!res.headersSent) {
//           res.status(500).json({ error: 'Download failed' });
//         }
//       });
//       return;
//     }

//     // Nếu cần merge video và audio
//     if (!videoItag || !audioItag) {
//       return res.status(400).json({ error: 'Video and audio itags are required for merging' });
//     }

//     // Tạo streams cho video và audio
//     const videoStream = ytdl(url, { quality: videoItag });
//     const audioStream = ytdl(url, { quality: audioItag });

//     // Tạo ffmpeg command để merge
//     const ffmpegCommand = ffmpeg()
//       .input(videoStream)
//       .input(audioStream)
//       .outputOptions([
//         '-c:v copy',  // Copy video codec (không re-encode)
//         '-c:a aac',   // Convert audio to AAC
//         '-strict experimental'
//       ])
//       .format('mp4')
//       .on('start', (commandLine) => {
//         console.log('FFmpeg started:', commandLine);
//       })
//       .on('progress', (progress) => {
//         console.log('Processing: ' + progress.percent + '% done');
//       })
//       .on('end', () => {
//         console.log('FFmpeg finished');
//       })
//       .on('error', (err, stdout, stderr) => {
//         console.error('FFmpeg error:', err);
//         console.error('FFmpeg stderr:', stderr);
//         if (!res.headersSent) {
//           res.status(500).json({ error: 'Video processing failed' });
//         }
//       });

//     // Pipe output to response
//     ffmpegCommand.pipe(res, { end: true });

//   } catch (error) {
//     console.error('Error downloading video:', error);
//     if (!res.headersSent) {
//       res.status(500).json({ error: 'Failed to download video' });
//     }
//   }
// }

// // Increase timeout for video processing
// export const config = {
//   api: {
//     responseLimit: false,
//     bodyParser: {
//       sizeLimit: '50mb',
//     },
//   },
//   maxDuration: 300, // 5 minutes timeout
// };