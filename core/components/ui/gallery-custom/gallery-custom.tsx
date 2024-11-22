import { BcImage } from '~/components/bc-image';

interface Image {
  altText: string;
  src: string;
}

interface Props {
  className?: string;
  images: Image[];
}

const GalleryCustom = ({ className, images }: Props) => {
  return (
    <div aria-live="polite" className={className}>
      { images && images.length ? (
        <div className="grid grid-cols-2 gap-6">
            {images.map((image, index) => (
              <BcImage
                alt={image.altText}
                className="h-full w-full object-contain"
                height={800}
                priority={true}
                src={image.src}
                key={image.src}
                width={800}
              />
            ))}
        </div>
      ) : (
        <div className="flex aspect-square items-center justify-center bg-gray-200">
          <div className="text-base font-semibold text-gray-500">Coming soon</div>
        </div>
      )}
    </div>
  );
};

export { GalleryCustom };
