import React from 'react'
import Spinner from "@/components/Spinner";

export const LoadingFallback = () => {
    return (
        <div className=" h-screen w-full flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    )
}
