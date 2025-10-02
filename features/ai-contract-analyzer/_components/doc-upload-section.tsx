"use client";

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CloudCheck, CloudUpload } from 'lucide-react';
import React, { useState } from 'react'
import { useDropzone } from "react-dropzone"
import { useUpload } from '../hooks/use-upload';
import { ResultDoc } from '@/app/ai-contract-analyzer/ResultDoc';




export const DocUploadSection = () => {
    const {mutate , isPending , data , isSuccess} = useUpload()
    const contract = data?.data;
    const [file, setFile] = useState<File | null>(null);
    const onDrop = (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0])
    };
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
        }
    });


    const onSubmit = async () => {
        if (!file) {
            toast.error('Please select a contract file first.');
            return;
        }

        const formData = new FormData();
        formData.append('doc', file);

        mutate(formData);
    }



    return (
        <section
            className=' h-full'
        >
            {isSuccess && contract ? (
                <ResultDoc contractData={contract} />
            ) : (
                <div className=' h-full w-full flex items-center justify-center'>
                    <div  className="w-full max-w-sm md:max-w-3xl bg-accent p-3 rounded-md flex flex-col gap-4">
                        <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-md h-36 text-center cursor-pointer ">
                            <input {...getInputProps()} />
                            {file ? (
                                <div className=' h-full flex flex-col items-center justify-center'>
                                    <CloudCheck className=' text-primary size-8' />
                                    <p>{file.name}</p>
                                </div>
                            ) : (
                                <div className=' flex flex-col items-center justify-center gap-2 h-full'>
                                    <CloudUpload className=' text-primary size-8' />
                                    <p className=' text-muted-foreground text-sm'>Drag & drop contract file here, or click to select</p>
                                </div>
                            )}


                        </div>
                        <div className=' flex items-center justify-end'>
                        <Button onClick={onSubmit}>
                            {isPending ? "Analyzing..." : "Upload & Analyze"}
                        </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}