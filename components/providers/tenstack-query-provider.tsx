"use client";

import { getQueryClient } from '@/lib/get-query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

export const TanstackQueryProvider = ({children} : {children : ReactNode}) => {

    return(
        <QueryClientProvider client={getQueryClient()} >
            {children}
        </QueryClientProvider>
    )
}