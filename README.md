# enhanced-area-card
![SCR-20231002-it5](https://github.com/dannyvfilms/enhanced-area-card/assets/44555970/30831894-4daf-4588-b1c6-d4d93d332075)

This is a custom card for Home Assistant allowing users to display various entities and control them with buttons, with the option to display background images or camera feeds.

## Installation

1. Download the `enhanced-area-card.js` file from the repository.
2. Place the file in your `config/www` directory.
3. Add the following to your `ui-lovelace.yaml` or through the Raw Config editor in the UI:
   ```yaml
   resources:
     - url: /local/enhanced-area-card.js
       type: module

## Configuration

Here is an example of how you can configure the card:
```
type: custom:content-card-example
aspect_ratio: '24:1'
title: Living Room
subtitle: camera.porch_wide_high
sensor1: sensor.living_room_c194_temperature
sensor2: sensor.living_room_c194_humidity
background_image: 'https://www.example.com/your-image.png'
background_dimmer: 50
media_player: media_player.living_room
camera_image: camera.porch_wide_high
camera_motion: camera.porch_doorbell_high
buttons:
  - entity: light.entry_light
    icon: mdi:light-recessed
    tap_action:
      action: toggle
  - entity: light.floor_lamp
    icon: mdi:lamp
    tap_action:
      action: toggle
  - entity: switch.fan_outlet1
    icon: mdi:fan
    tap_action:
      action: toggle
  - entity: scene.tv_lights
    icon: mdi:palette
    tap_action:
      action: toggle
```

## Features
1. The card can support a dynamic number of buttons. Simply add more and the grid will adjust.
2. The card can change aspect ratios by changing `aspect_ratio: '24:1'`
3. The background image can be darkened to taste by using `background_dimmer` ranging from 0 to 100.
4. The background image will be replaced with the `media player` poster when the `media_player` is `playing` or `paused`.
5. The background image will be replaced with the `camera_image` poster when the `camera_motion` is triggered.

## Options
- type (Required): Must be custom:content-card-example.
- aspect_ratio (Optional): The aspect ratio of the card, in the format 'width:height'. Default is '16:9'.
- title (Required): The title of the card.
- subtitle (Required): The entity ID of the subtitle of the card.
- sensor1 (Required): The entity ID of the first sensor.
- sensor2 (Required): The entity ID of the second sensor.
- background_image (Optional): URL of the background image.
- background_dimmer (Optional): Integer between 0 and 100 representing the percentage to darken the background image.
- media_player (Optional): The entity ID of a media player to display when playing or paused.
- camera_image (Optional): The entity ID of a camera to display as the background when the associated motion sensor is triggered.
- camera_motion (Optional): The entity ID of a motion sensor associated with the camera.
- buttons (Required): A list of button configurations, each containing:
- entity (Required): The entity ID the button controls.
- icon (Required): The icon for the button, in mdi format.
- tap_action (Required): The action to perform when the button is tapped.
