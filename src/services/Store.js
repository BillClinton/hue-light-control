import { convertRGBToXY, approximateBrightness } from '../services/Util.js';

const Store = {
  lights: {},
  rooms: {},
  config: {
    ip: '',
    key: '',
  },

  initialize: () => {
    const hueConfig = document.querySelector('hue-config');
    if (!hueConfig) {
      console.warn(
        `No <hue-config> element found.  Please add a <hue-config> element to your document.`
      );
      return false;
    }
    if (!hueConfig.dataset.ip || !hueConfig.dataset.key) {
      console.warn(
        `The <hue-config> element must have 'data-ip' and 'data-key' attributes.`
      );
      return false;
    }
    app.store.config = {
      ip: hueConfig.dataset.ip,
      key: hueConfig.dataset.key,
    };
    return true;
  },

  load: async () => {
    await app.store.fetchLights();
    document.dispatchEvent(new Event('hue-data-loaded'));
  },

  fetchLights: async () => {
    const result = await fetch(
      `http://${app.store.config.ip}/api/${app.store.config.key}/lights`
    );
    const response = await result.json();
    if (response[0]?.error) {
      console.warn(
        `error communicating with Hue bridge: ${response[0].error.description}`
      );
      app.store.lights = {};
    } else {
      app.store.lights = response;
    }
  },

  getLightData: (lightID) => {
    const light = app.store.lights[lightID];
    if (!light) {
      return null;
    }
    const state = light.state;

    return {
      id: lightID,
      state: JSON.stringify(state),
      name: light.name,
      modelid: light.modelid,
    };
  },

  setOnState: async (lightID, on = true) => {
    const result = await fetch(
      `http://${app.store.config.ip}/api/${app.store.config.key}/lights/${lightID}/state`,
      {
        method: 'PUT',
        body: JSON.stringify({ on: on }),
      }
    );
    const response = await result.json();
    app.store.updateState(response);
  },

  setBrightnessState: async (lightID, bri, update = false) => {
    const result = await fetch(
      `http://${app.store.config.ip}/api/${app.store.config.key}/lights/${lightID}/state`,
      {
        method: 'PUT',
        body: JSON.stringify({ bri: bri }),
      }
    );
    const response = await result.json();
    if (update) {
      app.store.updateState(response);
    }
  },

  setColorState: async (lightID, color, modelID, update = false) => {
    let xy = convertRGBToXY(color, modelID);
    let bri = approximateBrightness(color);

    const result = await fetch(
      `http://${app.store.config.ip}/api/${app.store.config.key}/lights/${lightID}/state`,
      {
        method: 'PUT',
        body: JSON.stringify({ xy: Object.values(xy), bri: bri }),
      }
    );
    const response = await result.json();
    if (update) {
      app.store.updateState(response);
    }
  },

  updateState: (response) => {
    // loop through the response array to handle multiple responses
    for (let i = 0; i < response.length; i++) {
      const res = response[i];
      if (res.success) {
        const path = Object.keys(res.success)[0];
        const val = Object.values(res.success)[0];
        const pathItems = path.split('/');
        const lightId = pathItems[2];
        const key = pathItems[4];
        const acceptableKeys = ['on', 'xy', 'bri'];

        if (acceptableKeys.includes(key)) {
          app.store.lights[lightId].state[key] = val;
        } else {
          console.warn(
            `<${key}> is not a valid setting.  Requested path: ${path}`
          );
        }
      } else {
        if (res.error && res.error.description) {
          console.warn(`Hue bridge: ${res.error.description}`);
        }
      }
    }
    document.dispatchEvent(new Event('hue-data-loaded'));
  },

  updateVal: (id, key, val) => {
    const acceptableKeys = ['on', 'xy', 'bri'];
    console.log('updateVal', id, key, val);

    if (acceptableKeys.includes(key)) {
      app.store.lights[id].state[key] = val;
    } else {
      console.warn(`<${key}> is not a valid setting.  Requested path: ${path}`);
    }
  },
};

export default Store;
