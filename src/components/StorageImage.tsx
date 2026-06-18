type StorageImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
};

export default function StorageImage({
  src,
  alt,
  className = "",
  fill = false,
  priority = false,
}: StorageImageProps) {
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : undefined;

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      className={className}
    />
  );
}
