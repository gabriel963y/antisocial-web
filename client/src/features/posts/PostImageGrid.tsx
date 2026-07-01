import { getPostImageUrl } from '../../lib/helpers/postHelpers.ts'
import type { PostImage } from '../../types/post.ts'

type PostImageGridProps = {
    images: PostImage[]
}

export function PostImageGrid({ images }: PostImageGridProps) {
    const validImages = images.filter((image) => getPostImageUrl(image))

    if (validImages.length === 0) return null

    if (validImages.length === 1) {
        return (
            <div className="mt-4 overflow-hidden border border-lime-400/10">
                <img
                    src={getPostImageUrl(validImages[0])}
                    alt="imagen del post"
                    className="max-h-[520px] w-full object-cover"
                />
            </div>
        )
    }

    if (validImages.length === 2) {
        return (
            <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden border border-lime-400/10">
                {validImages.slice(0, 2).map((image, index) => (
                    <img
                        key={image.image_id ?? image.id ?? image._id ?? index}
                        src={getPostImageUrl(image)}
                        alt="imagen del post"
                        className="h-80 w-full object-cover"
                    />
                ))}
            </div>
        )
    }

    if (validImages.length === 3) {
        return (
            <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden border border-lime-400/10">
                <img
                    src={getPostImageUrl(validImages[0])}
                    alt="imagen del post"
                    className="h-[420px] w-full object-cover"
                />

                <div className="grid grid-rows-2 gap-1">
                    {validImages.slice(1, 3).map((image, index) => (
                        <img
                            key={image.image_id ?? image.id ?? image._id ?? index}
                            src={getPostImageUrl(image)}
                            alt="imagen del post"
                            className="h-full w-full object-cover"
                        />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden border border-lime-400/10">
            {validImages.slice(0, 4).map((image, index) => {
                const remainingImages = validImages.length - 4
                const isLastImage = index === 3 && remainingImages > 0

                return (
                    <div
                        key={image.image_id ?? image.id ?? image._id ?? index}
                        className="relative"
                    >
                        <img
                            src={getPostImageUrl(image)}
                            alt="imagen del post"
                            className="h-64 w-full object-cover"
                        />

                        {isLastImage && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <span className="text-3xl font-semibold text-white">
                                    +{remainingImages}
                                </span>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}