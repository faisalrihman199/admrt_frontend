import React from 'react'
import { CardPlacehoderSkeleton } from './AddSpaceSearchCardSkeleton'

export const AddSpaceSearchCardSkeletonWrapper = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-20">
            {Array(8).fill().map((_, i) => <CardPlacehoderSkeleton key={i} />)}
        </div>
    )
}