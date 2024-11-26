import { Spinner } from "@material-tailwind/react";

export function CustomSpinner() {
    return (
        <div className="flex items-center justify-center ">
            <Spinner className="h-10 w-10 sm:h-20 sm:w-20 md:h-30 md:w-30 lg:h-40 lg:w-40 xl:h-50 xl:w-50 text-gray-900/50" />
        </div>
    );
}