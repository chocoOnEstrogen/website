'use client'

import { useRef, useState } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  Volume1, 
  VolumeX,
  Volume
} from 'lucide-react'

interface VideoPlayerProps {
  src: string
  controls?: boolean
}

export function VideoPlayer({ src, controls = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      videoRef.current.currentTime = percentage * videoRef.current.duration
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-4 h-4" />
    if (volume < 0.3) return <Volume className="w-4 h-4" />
    if (volume < 0.7) return <Volume1 className="w-4 h-4" />
    return <Volume2 className="w-4 h-4" />
  }

  return (
    <div className="relative group rounded-lg overflow-hidden bg-gray-900 markdown-video-player">
      <video
        ref={videoRef}
        src={src}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="text-white hover:text-purple-400 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <div
            className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-1 w-24">
            <span className="text-white">
              {getVolumeIcon()}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 