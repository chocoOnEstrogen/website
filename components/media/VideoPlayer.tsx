'use client'

import { useRef, useState } from 'react'
import { Play, Pause, Volume2, Volume1, VolumeX, Volume } from 'lucide-react'

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
			const progress =
				(videoRef.current.currentTime / videoRef.current.duration) * 100
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
		if (volume === 0) return <VolumeX className="h-4 w-4" />
		if (volume < 0.3) return <Volume className="h-4 w-4" />
		if (volume < 0.7) return <Volume1 className="h-4 w-4" />
		return <Volume2 className="h-4 w-4" />
	}

	return (
		<div className="markdown-video-player group relative overflow-hidden rounded-lg bg-gray-900">
			<video
				ref={videoRef}
				src={src}
				className="w-full"
				onTimeUpdate={handleTimeUpdate}
				onClick={togglePlay}
			/>

			<div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
				<div className="flex items-center gap-2">
					<button
						onClick={togglePlay}
						className="text-white transition-colors hover:text-purple-400"
					>
						{isPlaying ?
							<Pause className="h-6 w-6" />
						:	<Play className="h-6 w-6" />}
					</button>

					<div
						className="h-1 flex-1 cursor-pointer rounded-full bg-gray-700"
						onClick={handleProgressClick}
					>
						<div
							className="h-full rounded-full bg-purple-500"
							style={{ width: `${progress}%` }}
						/>
					</div>

					<div className="flex w-24 items-center gap-1">
						<span className="text-white">{getVolumeIcon()}</span>
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
