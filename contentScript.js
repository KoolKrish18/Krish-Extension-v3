let youtubeLeftControls, youtubePlayer;
let currentVideo = '';
let currentVideoBookmarks = [];

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type, value, videoId } = obj;

  if (type === 'NEW') {
    currentVideo = videoId;
  }
});

const fetchBookmarks = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([currentVideo], (obj) => {
      const result = obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [];
      console.log(result);
      resolve(result);
    });
  });
};

const newVideoLoaded = async () => {
  const bookmarkBtnExists = document.getElementsByClassName('bookmark-btn')[0];
  // currentVideoBookmarks = await fetchBookmarks();

  if (!bookmarkBtnExists) {
    const bookmarkBtn = document.createElement('img');

    bookmarkBtn.src = chrome.runtime.getURL('assets/bookmark.png');
    bookmarkBtn.className = 'ytp-button' + 'bookmark-btn';
    bookmarkBtn.title = 'Click to bookmark current timestamp';

    youtubeLeftControls =
      document.getElementsByClassName('ytp-left-controls')[0];
    youtubePlayer = document.getElementsByClassName('video-stream')[0];

    youtubeLeftControls.appendChild(bookmarkBtn);
    bookmarkBtn.addEventListener('click', addNewBookmarkEventHandler);
  }
};

const addNewBookmarkEventHandler = async () => {
  console.log('11');
  const currentTime = youtubePlayer.currentTime;
  const newBookmark = {
    time: currentTime,
    desc: 'Bookmark at ' + getTime(currentTime),
  };

  fetchBookmarks().then((currentVideoBookmarks) => {
    console.log(currentVideoBookmarks);
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  });
};

newVideoLoaded();

const getTime = (t) => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};
