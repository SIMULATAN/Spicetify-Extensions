// NAME: Copy Link without Tracking
// AUTHOR: SIMULATAN
// DESCRIPTION: Adds a "copy link" button that copies the link to the item *without* spotify's tracking

/// <reference path="globals.d.ts" />

let copyLinkCount = 0;
(async function copyLink() {
  if (!Spicetify && copyLinkCount < 1000) {
    setTimeout(copyLink, 10);
    copyLinkCount++;
    return;
  }
  initCopyLink();
})();

function initCopyLink() {
  const {Type} = Spicetify.URI;

  async function getText(uris) {
    const uri = Spicetify.URI.fromString(uris[0]);
    const id = uri._base62Id ?? uri.id ?? uri.username;

    switch (uri.type) {
      case Type.TRACK:
        sendToClipboard(`https://open.spotify.com/track/${id}`);
        break;
      case Type.ALBUM:
        sendToClipboard(`https://open.spotify.com/album/${id}`);
        break;
      case Type.ARTIST:
				sendToClipboard(`https://open.spotify.com/artist/${id}`)
        break;
      case Type.PLAYLIST:
      case Type.PLAYLIST_V2:
				sendToClipboard(`https://open.spotify.com/playlist/${id}`)
        break;
      case Type.SHOW:
				sendToClipboard(`https://open.spotify.com/show/${id}`)
        break;
      case Type.EPISODE:
				sendToClipboard(`https://open.spotify.com/episode/${id}`)
      case Type.PROFILE:
				sendToClipboard(`https://open.spotify.com/user/${id}`)
        break;
      default:
        break;
    }
  }

  function sendToClipboard(text) {
    if (text) {
      Spicetify.showNotification(`Link Copied!`);
      Spicetify.Platform.ClipboardAPI.copy(text);
    }
  }

  function shouldAddContextMenu(uris) {
    if (uris.length === 1) {
      const uri = Spicetify.URI.fromString(uris[0]);
      switch (uri.type) {
        case Type.TRACK:
        case Type.ALBUM:
        case Type.ARTIST:
        case Type.PLAYLIST:
        case Type.PLAYLIST_V2:
        case Type.SHOW:
        case Type.EPISODE:
        case Type.PROFILE:
          return true;
      }
    }
		return false;
  }

  new Spicetify.ContextMenu.Item(
    'Copy Link',
    getText,
    shouldAddContextMenu,
    'copy',
  ).register();
}

