import { getActiveTabURL } from "./utils.js";

const viewBookmarks = (currentBookmarks = []) => {
    let bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";
    console.log("any");

    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            bookmarksElement.innerHTML += Object.values(bookmark);
        }
    } else {
        bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
};

const onPlay = (e) => {};

const onDelete = (e) => {};

const setBookmarkAttributes = () => {};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo]
                ? JSON.parse(data[currentVideo])
                : [];
            viewBookmarks(currentVideoBookmarks);

            // viewBookmarks
        });
    } else {
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML =
            '<div class="title">This is not a youtube video page.</div>';
    }
});
