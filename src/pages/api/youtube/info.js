const ytdl = require('@distube/ytdl-core');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Get video info
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;
    
    // Lấy formats có cả video và audio (thường là 360p và thấp hơn)
    const directFormats = info.formats
      .filter(format => format.hasVideo && format.hasAudio)
      .map(format => ({
        itag: format.itag,
        quality: format.qualityLabel || format.quality,
        container: format.container,
        size: format.contentLength ? 
          `${Math.round(format.contentLength / 1024 / 1024)} MB` : 
          'Unknown',
        url: format.url,
        isDirect: true,
        needsFFmpeg: false
      }));

    // Lấy video-only formats (thường là chất lượng cao hơn)
    const videoOnlyFormats = info.formats
      .filter(format => format.hasVideo && !format.hasAudio)
      .map(format => ({
        itag: format.itag,
        quality: format.qualityLabel || `${format.height}p`,
        container: format.container,
        size: format.contentLength ? 
          `${Math.round(format.contentLength / 1024 / 1024)} MB` : 
          'Unknown',
        url: format.url,
        isDirect: false,
        needsFFmpeg: true
      }));

    // Tìm audio format tốt nhất để kết hợp với video-only
    const bestAudio = info.formats
      .filter(format => format.hasAudio && !format.hasVideo)
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];

    // Thêm thông tin audio cho video-only formats
    const enhancedVideoOnlyFormats = videoOnlyFormats.map(format => ({
      ...format,
      audioItag: bestAudio?.itag,
      hasAudio: !!bestAudio
    }));

    // Kết hợp tất cả formats
    const allFormats = [...directFormats, ...enhancedVideoOnlyFormats];
    
    // Loại bỏ trùng lặp theo quality, ưu tiên direct formats (không cần ffmpeg)
    const qualityMap = new Map();
    
    allFormats.forEach(format => {
      const quality = format.quality;
      if (!qualityMap.has(quality)) {
        qualityMap.set(quality, format);
      } else {
        const existing = qualityMap.get(quality);
        // Ưu tiên format không cần ffmpeg
        if (!format.needsFFmpeg && existing.needsFFmpeg) {
          qualityMap.set(quality, format);
        }
      }
    });

    // Chuyển Map thành array và sắp xếp theo chất lượng
    const formats = Array.from(qualityMap.values())
      .sort((a, b) => {
        const getQualityValue = (quality) => {
          const match = quality.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };
        return getQualityValue(b.quality) - getQualityValue(a.quality);
      });

    const videoInfo = {
      title: videoDetails.title,
      thumbnail: (() => {
        const thumbnails = videoDetails.thumbnails;
        if (!thumbnails || thumbnails.length === 0) {
          return null;
        }
        
        const highQualityThumbnail = thumbnails.find(t => t.width >= 480) || 
                                    thumbnails[thumbnails.length - 1] ||
                                    thumbnails[0];
        
        return highQualityThumbnail.url;
      })(),
      duration: videoDetails.lengthSeconds,
      author: videoDetails.author.name,
      qualities: formats
    };

    res.status(200).json(videoInfo);
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ error: 'Failed to fetch video information' });
  }
}