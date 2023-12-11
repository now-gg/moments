export const Events = {
    EDIT_PAGE_IMPRESSION: "edit_page_impression",
    VIDEO_DOWNLOAD: "video_download",
    COPY_LINK_CLICK: "copy_link_click",
    RESET_CLICK: "reset_click",
}

export const sendStats = (event: string, data: any) => {
    const StatsEndpoint = `${import.meta.env.VITE_BACKEND_HOST}/video/stats`;
    fetch(StatsEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event,
            data
        })
    });
}