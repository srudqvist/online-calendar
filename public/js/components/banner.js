class Banner extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const customText =
      this.getAttribute("custom-text") || "Default Banner Text";
    const label = this.getAttribute("label");
    const currentURL = window.location.href;
    const lastSegment = currentURL.substring(currentURL.lastIndexOf("/") + 1);
    let isEventOrSchedule = false;
    let eventLabel, scheduleLabel;
    let eventLink, scheduleLink;

    if (lastSegment == "schedule.php" || lastSegment == "eventContainers.php") {
      [eventLabel, scheduleLabel] = customText.split("|");
      isEventOrSchedule = true;

      if (lastSegment == "schedule.php") {
        scheduleLink = `<a class="custom-link active" href="schedule.php">${scheduleLabel.trim()}</a>`;
        eventLink = `<a class="custom-link" href="eventContainers.php">${eventLabel.trim()}</a>`;
      } else {
        eventLink = `<a class="custom-link active" href="eventContainers.php">${eventLabel.trim()}</a>`;
        scheduleLink = `<a class="custom-link" href="schedule.php">${scheduleLabel.trim()}</a>`;
      }
    }

    this.innerHTML = `
      <style>
        banner {
          height: 60px;
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #96AE4D;
          color: #fff; 
        }
        #logOutLogo {
          height: 2rem;
          width: 2rem;
          margin-top: 5px;
          margin-left: 5px;
        }
        #accountDiv {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        a.custom-link {
          display: inline-block;
          font-weight: bold;
          color: gray; 
          text-decoration: none;
          padding: 5px 10px; 
        }
        a.custom-link:hover {
          cursor: pointer;
          color: whitesmoke; 
        }
        a.active {
          color: white
        }
      </style>
      <banner>
        ${
          isEventOrSchedule
            ? `<h3 id="bannerText">${eventLink} | ${scheduleLink}</h3>`
            : `<h3 id="bannerText">${customText}</h3>`
        }
        ${
          label
            ? `<div id="accountDiv">
              <span>Account: ${label}</span>
              <a href="../../../includes/logout.php">
                <img id="logOutLogo" src="img/logout.png" alt="log out logo">
              </a>
            </div>`
            : ""
        }
      </banner>
    `;
  }
}

customElements.define("banner-component", Banner);
