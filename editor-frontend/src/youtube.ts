export const uploadToYoutube = (videoInfo: any, privacy_status?: 'public' | 'private' | 'unlisted') => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const data = {
        "videoId": videoInfo.videoId,
        "videoUrl": videoInfo.downloadUrl,
        "title": videoInfo.title,
        "description": videoInfo.description,
        "privacy_status": privacy_status ?? 'public'
    }
    fetch(`${import.meta.env.VITE_BACKEND_HOST}/video/youtube-upload`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Error uploading to youtube');
        }
    }).then(data => {
        console.log(data);
    }
    ).catch(error => {
        console.log(error);
    }
    );
}

export const YOUTUBE_AUTH_URL = `${import.meta.env.VITE_BACKEND_HOST}/oauth2callback/youtube`;
