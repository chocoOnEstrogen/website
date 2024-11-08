interface ImageViewerProps {
	src: string
	alt: string
}

export function ImageViewer({ src, alt }: ImageViewerProps) {
	return (
		<figure className="markdown-image-viewer my-8">
			<div className="overflow-hidden rounded-lg">
				<img
					src={src}
					alt={alt}
					className="h-auto w-full transition-transform duration-300 hover:scale-105"
				/>
			</div>
			{alt && (
				<figcaption className="mt-2 text-center text-sm italic text-gray-400">
					{alt}
				</figcaption>
			)}
		</figure>
	)
}
