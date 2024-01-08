import React from "react";
import { toast } from "react-hot-toast";

// @ts-ignore
export const uploadToYoutube = (videoInfo: any, ytAccessToken: string, setUploadLoader: React.Dispatch<React.SetStateAction<boolean>>, youtubeLogin: () => void, isShort?: boolean) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${ytAccessToken}`);
    if (!videoInfo?.downloadUrl) {
        toast.error("Can't upload to youtube");
        return;
    }
    const description = isShort ? "#Shorts " + videoInfo.description : videoInfo.description;
    const data = {
        "videoId": videoInfo.videoId,
        "videoUrl": videoInfo.downloadUrl,
        "title": videoInfo.title,
        "description": description,
        "privacy_status": 'public'
    }

    const loading = toast.loading('Uploading to youtube...');
    setUploadLoader(true);

    fetch(`${import.meta.env.VITE_BACKEND_HOST}/video/youtube-upload`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        }
        if (response.status === 401) {
            setUploadLoader(false);
            toast.dismiss(loading);
            toast.error('Youtube token expired. Please login again');
            youtubeLogin();
        }
        else {
            toast.error('Error uploading to youtube');
        }
    }).then(data => {
        console.log(data);
        toast.success('Uploaded to youtube');
    }).catch(error => {
        console.log(error);
    }).finally(() => {
        toast.dismiss(loading);
        setUploadLoader(false);
    });
}

export const YOUTUBE_AUTH_URL = `${import.meta.env.VITE_BACKEND_HOST}/oauth2callback/youtube`;
