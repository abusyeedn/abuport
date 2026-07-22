interface MediaElementProps {
  src: string
  mediaType?: 'image' | 'video'
  objectFit?: 'cover' | 'contain' | 'fill'
}

export default function MediaElement({ src, mediaType = 'image', objectFit = 'contain' }: MediaElementProps) {
  if (mediaType === 'video') {
    return (
      <video
        src={src}
        controls
        style={{ width: '100%', height: '100%', objectFit, display: 'block', borderRadius: 4 }}
      />
    )
  }
  return (
    <img
      src={src}
      draggable={false}
      style={{ width: '100%', height: '100%', objectFit, display: 'block', borderRadius: 4 }}
      alt=""
    />
  )
}
