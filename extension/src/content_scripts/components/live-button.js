/**
 * Return Lyspace button depending on the service.
 *
 * @param {Object} data
 * @param {String} data.service
 *
 */
module.exports = ({ liveStream }) => {
  const lyspaceButton = document.createElement("lyspace-button");
  const button = document.createElement("div");
  const anchor = document.createElement("a");

  anchor.setAttribute("href", liveStream.url);
  anchor.setAttribute("target", "_blank");
  anchor.style.textDecoration = "none";

  button.innerText += "LIVE NOW";

  button.style.color = "white";
  button.style.fontSize = "13px";
  button.style.marginLeft = "5px";
  button.style.padding = "0px 5px";
  button.style.borderRadius = "2px";

  switch (liveStream.serviceName) {
    case "TWITCH":
      button.style.backgroundColor = "#9147FF";
      break;
    default:
      button.style.backgroundColor = "#DC143C";
  }

  anchor.appendChild(button);

  lyspaceButton.appendChild(anchor);

  return lyspaceButton;
};
