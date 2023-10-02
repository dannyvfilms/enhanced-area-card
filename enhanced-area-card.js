class ContentCardExample extends HTMLElement {
    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.
    set hass(hass) {
      if (!this.content) {
        const aspectRatioPaddingTop = (parseInt(this.config.aspect_ratio.split(':')[1]) / parseInt(this.config.aspect_ratio.split(':')[0])) * 100;
        const numberOfColumns = Math.ceil(Math.sqrt(this.config.buttons.length));
        this.innerHTML = `
          <ha-card>
            <style>
              ha-card {
                border-radius: 12px; /* Adjust as needed */
                overflow: hidden; /* Ensures content does not spill out of rounded corners */
              }
              .card-content {
                color: white;
                text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: space-between;
                align-items: center; /* Vertically centers the content */
                padding: 10px; /* Adjust as needed */
                padding-top: ${aspectRatioPaddingTop}%; /* Maintain aspect ratio */
              }
              .title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 1px;
              }
              .subtitle {
                font-size: 14px;
                margin-bottom: 1px;
              }
              .sensors {
                display: flex;
                gap: 10px;
                font-size: 14px;
                position: absolute;
                bottom: 10px; /* Adjust as needed */
                left: 10px; /* Adjust as needed */
              }
              .button {
                background-color: rgba(255, 255, 255, 0.5);
                border: none;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
              }
              .right {
                display: grid;
                grid-template-columns: repeat(${numberOfColumns}, 1fr);
                gap: 5px;
              }
            </style>
            <div class="card-content">
              <div class="left">
                <div class="title">${this.config.title}</div>
                <div class="subtitle"></div>
                <div class="sensors">
                  <span class="sensor1"></span> | <span class="sensor2"></span>
                </div>
              </div>
              <div class="right">
                ${this.config.buttons.map((_, index) => `<button class="button" id="button${index}"></button>`).join('')}
              </div>
            </div>
          </ha-card>
        `;

        this.content = this.querySelector(".card-content");
      }
    
      const subtitleEntityId = this.config.subtitle;
      const subtitleState = hass.states[subtitleEntityId];
      const subtitleStateStr = subtitleState ? subtitleState.state : "unavailable";
      this.content.querySelector(".subtitle").innerHTML = `Occupancy: ${subtitleStateStr}`;
    
      // Inside set hass(hass) method
      const sensor1EntityId = this.config.sensor1;
      const sensor1State = hass.states[sensor1EntityId];
      const sensor1StateStr = sensor1State ? sensor1State.state : "unavailable";
      this.content.querySelector(".sensor1").innerHTML = `${sensor1StateStr}°`;

      const sensor2EntityId = this.config.sensor2;
      const sensor2State = hass.states[sensor2EntityId];
      const sensor2StateStr = sensor2State ? sensor2State.state : "unavailable";
      this.content.querySelector(".sensor2").innerHTML = `${sensor2StateStr}%`;

      this.config.buttons.forEach((buttonConfig, index) => {
        const button = this.content.querySelector(`#button${index}`);
        button.innerHTML = `<ha-icon icon="${buttonConfig.icon}"></ha-icon>`;
        button.addEventListener('click', () => {
          if (buttonConfig.tap_action.action === 'toggle') {
            const domain = buttonConfig.entity.split('.')[0]; // Extracts 'light' from 'light.some_light'
            hass.callService(domain, 'toggle', { entity_id: buttonConfig.entity });
          } else if (buttonConfig.tap_action.service) {
            const [domain, service] = buttonConfig.tap_action.service.split('.');
            hass.callService(domain, service, buttonConfig.tap_action.service_data);
          }
        });        
        // Similarly, add event listeners for hold and double-tap actions if needed
      });

      let backgroundImage = this.config.background_image || '';
      const dimmer = this.config.background_dimmer || 0;

      const mediaPlayerEntity = hass.states[this.config.media_player];
      if (mediaPlayerEntity && ['playing', 'paused'].includes(mediaPlayerEntity.state)) {
        backgroundImage = mediaPlayerEntity.attributes.entity_picture || backgroundImage;
      }

      const motionSensorEntity = hass.states[this.config.camera_motion];
      const cameraEntity = hass.states[this.config.camera_image];
      if (motionSensorEntity && motionSensorEntity.state === 'on' && cameraEntity) {
        backgroundImage = `/api/camera_proxy_stream/${this.config.camera_image}?token=${cameraEntity.attributes.access_token}`;
      }

      const dimmerValue = 100 - dimmer; // 0 means no darkening, 100 means completely dark
      this.content.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${dimmerValue / 100}), rgba(0, 0, 0, ${dimmerValue / 100})), url('${backgroundImage}')`;
      this.content.style.backgroundSize = 'cover';
      this.content.style.backgroundPosition = 'center';
    }
  
    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) {
      if (!config.title || !config.subtitle || !config.sensor1 || !config.sensor2) {
        throw new Error("You need to define a title and entities for subtitle, sensor1, and sensor2");
      }
      if (!config.aspect_ratio) {
        throw new Error("You need to define an aspect_ratio");
      }
      const [width, height] = config.aspect_ratio.split(':');
      if (!width || !height || isNaN(width) || isNaN(height)) {
        throw new Error("Invalid aspect_ratio, it should be in 'width:height' format, e.g. '16:9'");
      }
      this.config = config;
    }
  
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 3;
    }
  }
  
  customElements.define("content-card-example", ContentCardExample);