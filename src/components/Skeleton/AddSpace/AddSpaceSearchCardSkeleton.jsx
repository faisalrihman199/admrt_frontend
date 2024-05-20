import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { avatar } from "../../../modul/main";

export function CardPlacehoderSkeleton() {
    return (
        <div className="border rounded-lg px-7 shadow-md max-w-sm max-h-65 px-10 flex flex-col flex-wrap hover:shadow-xl hover:cursor-pointer animate-pulse">
            <div className='flex gap-3 mt-5'>
                <div className=''>
                    <img className='h-20 w-20 rounded-full' src={avatar} alt="iconYoutuber" />
                </div>
                <div className=' w-40'>
                    <div
                        as="div"
                        variant="paragraph"
                        className="font-semibold h-4  bg-gray-300 rounded-full"
                    >
                        &nbsp;
                    </div>
                    <div
                        as="div"
                        variant="paragraph"
                        className="text-gray-500 text-sm  mt-2 h-3   bg-gray-300 rounded-full"
                    >
                        &nbsp;
                    </div>
                </div>
            </div>
            <div className='text-left p-3 mt-2 text-sm'>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-2 h-2 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-2 h-2 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-2 h-2 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-2 h-2 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
            </div>
            <div className='flex gap-3 p-3 justify-between mt-5'>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="text-sm text-gray-500 h-2 w-1/4 rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <div className='flex gap-1 justify-end'>
                    <Typography
                        as="div"
                        variant="paragraph"
                        className="h-8 w-8 rounded-full bg-gray-300"
                    >
                        &nbsp;
                    </Typography>
                    <Typography
                        as="div"
                        variant="paragraph"
                        className="h-8 w-8 rounded-full bg-gray-300"
                    >
                        &nbsp;
                    </Typography>
                </div>
            </div>
        </div>
    );
}