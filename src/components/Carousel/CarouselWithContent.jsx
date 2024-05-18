import { Carousel, Typography } from "@material-tailwind/react";

export function CarouselWithContent({ description, imageUrls, fullScreenMode = false }) {
    console.log('imageUrls', imageUrls)

    return (
        <Carousel className="rounded-xl    " autoplay={!fullScreenMode}>
            {imageUrls.map((imageUrl, index) => (
                <div key={index} className="relative dsds">
                    <img
                        src={imageUrl}
                        alt={`image ${index + 1}`}
                        className="object-cover "
                    />
                    {fullScreenMode && index === 0 && (
                        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
                            <div className="w-3/4 md:w-2/4 p-1 text-left">
                                <Typography
                                    variant="h1"
                                    color="white"
                                    className={`mb-4 ${description.length < 50 ? 'text-sm' : description.length < 100 ? 'text-base' : 'text-lg'}`}
                                >
                                    {description}
                                </Typography>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            {fullScreenMode && (
                <div className="relative h-full w-full">
                    <img
                        src={imageUrls[0]}
                        alt="image 1"
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
        </Carousel>
    );
}