import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Existing ffmpeg configuration
    config.resolve.alias['@ffmpeg-installer/ffmpeg'] = path.join(__dirname, 'node_modules/@ffmpeg-installer/ffmpeg');

    // New audio file handling
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]'
      }
    });

    return config;
  },
};

export default nextConfig;