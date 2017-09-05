class GMessage {
  constructor(
    title,
    subtitle
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.buttons = [];
    this.thumbnail = [];
  }

  //Limit of 3 buttons
  addButton(title, webURL) {
    this.buttons.push([title, webURL]);
  }

  addThumbnail(imageURL, webURL) {
    if (webURL === undefined) {
      this.thumbnail = [imageURL];
    } else {
      this.thumbnail = [imageURL, webURL];
    }
  }
}

module.exports = GMessage;
