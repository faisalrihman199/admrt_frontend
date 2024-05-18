import { Carousel, Typography } from "@material-tailwind/react";

export function CarouselWithContent({ description, imageUrls, fullScreenMode = false }) {
    console.log('imageUrls', imageUrls)

    return (
        <Carousel className={`rounded-xl flex ${fullScreenMode ? 'px-4' : ''}`} autoplay={true}>
            {imageUrls.map((imageUrl, index) => (
                <div key={index} className="flex flex-col justify-center items-center">

                    <img
                        src={imageUrl}
                        alt={`image ${index + 1}`}
                        className="object-cover rounded-xl"
                        style={{ height: fullScreenMode ? '700px' : '220px' }}
                    />
                    {fullScreenMode && (
                        <div className="w-3/4 md:w-2/4 p-1 text-left">
                            <Typography
                                variant="h1"
                                color="black"
                                className={`mb-4 ${description.length < 50 ? 'text-md' : description.length < 100 ? 'text-base' : 'text-lg'}`}
                            >
                                {description}
                            </Typography>
                        </div>
                    )}
                </div>
            ))}
            {/* {fullScreenMode && (
                <div className="relative h-full w-full">
                    <img
                        src={imageUrls[0]}
                        alt="image 1"
                        className="h-full w-full object-cover"
                    />
                </div>
            )} */}
        </Carousel>
    );
}