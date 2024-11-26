import React from 'react';

export const UserProfileSkeleton = () => {
    return (
        <div className="bg-gray-100 animate-pulse">
            <div className="mx-auto p-5">
                <div className="grid grid-cols-3 gap-4 ">
                    <div className="col-span-2 border border-gray-300 p-5 rounded">
                        <div className="relative">
                            <div className="w-full h-60 bg-gray-300"></div>
                            <div className="absolute top-2 right-2 bg-gray-300 p-2 rounded-full shadow-md w-8 h-8"></div>
                        </div>

                        <div className="flex mt-4">
                            <div className="w-1/4">
                                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto"></div>
                                <div className="bg-gray-300 h-6 mt-2 rounded mx-auto w-3/4"></div>
                            </div>
                            <div className="w-3/4 pl-4">
                                <div className="flex justify-between items-center">
                                    <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
                                    <div className="bg-gray-300 h-8 w-16 rounded"></div>
                                </div>
                                <div className="bg-gray-300 h-4 mt-2 rounded w-full"></div>
                                <div className="bg-gray-300 h-4 mt-2 rounded w-5/6"></div>
                                <div className="bg-gray-300 h-4 mt-2 rounded w-4/6"></div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between items-center">
                                <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
                                <div className="bg-gray-300 h-8 w-24 rounded"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                <div className="bg-white p-4 shadow rounded">
                                    <div className="w-full h-40 bg-gray-300"></div>
                                    <div className="bg-gray-300 h-6 mt-2 rounded w-3/4"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-full"></div>
                                </div>
                                <div className="bg-white p-4 shadow rounded">
                                    <div className="w-full h-40 bg-gray-300"></div>
                                    <div className="bg-gray-300 h-6 mt-2 rounded w-3/4"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-full"></div>
                                </div>
                                <div className="bg-white p-4 shadow rounded">
                                    <div className="w-full h-40 bg-gray-300"></div>
                                    <div className="bg-gray-300 h-6 mt-2 rounded w-3/4"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="mt-8 flex">
                            <div className="w-3/4">
                                <div className="bg-white p-4 shadow rounded mb-4">
                                    <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-full"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-2/3"></div>
                                </div>
                                <div className="bg-white p-4 shadow rounded mb-4">
                                    <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-full"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-2/3"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-1/4"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-1/3"></div>
                                </div>
                                <div className="bg-white p-4 shadow rounded">
                                    <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                                    <div className="bg-gray-300 h-4 mt-2 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
