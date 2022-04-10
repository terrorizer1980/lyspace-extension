/**
 * Return Lyspace button depending on the service.
 *
 * @param {Object} data
 * @param {String} data.service
 *
 */
module.exports = ({ service }) => {
  const lyspaceButton = document.createElement("lyspace-button");
  const button = document.createElement("div");
  button.innerText += "LIVE NOW";

  button.style.color = "white";
  button.style.fontSize = "13px";
  button.style.marginLeft = "5px";
  button.style.padding = "0px 5px";
  button.style.borderRadius = "2px";

  switch (service) {
    case "twitch":
      button.style.backgroundColor = "#9147FF";
      break;
    default:
      button.style.backgroundColor = "#DC143C";
  }

  lyspaceButton.appendChild(button);

  return lyspaceButton;
};
