export const Events = {
    EDIT_PAGE_IMPRESSION: "edit_page_impression",
    VIDEO_DOWNLOAD: "video_download",
    COPY_LINK_CLICK: "copy_link_click",
    RESET_CLICK: "reset_click",
}

export const sendStats = (event: string, videoId: string, userData?: any) => {
    const userId = userData?.userId || "";
    const formData = new FormData();
    formData.append("event_type", event);
    formData.append("arg1", userId);
    formData.append("arg2", videoId);
    formData.append("tag", "moments");
    const statsUrl = `${import.meta.env.VITE_BS_CLOUD_HOST}/app_player/miscellaneousstats`;
    fetch(statsUrl, {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.error('error', error));
}