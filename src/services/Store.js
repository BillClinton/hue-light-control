import { convertRGBToXY, approximateBrightness } from '../services/Util.js';

const Store = {
  lights: {},
  rooms: {},
  config: {
    ip: '',
    key: '',
  },

  loadAll: async () => {
    let response = await Promise.all([
      app.store.fetchLights(),
      app.store.fetchRooms(),
    ]);
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

  fetchRooms: async () => {
    const result = await fetch(
      `http://${app.store.config.ip}/api/${app.store.config.key}/groups`
    );
    const response = await result.json();
    if (response[0]?.error) {
      console.warn(
        `error communicating with Hue bridge: ${response[0].error.description}`
      );
      app.store.rooms = {};
    } else {
      app.store.rooms = response;
    }
  },

  getLight: (lightID) => {
    return app.store.lights[lightID] || null;
  },

  setOnState: async (lightID, on = true) => {
    const result = await fetch(
      `http://${app.store.config.ip}/api/${app.store.config.key}/lights/${lightID}/state`,
      {
        method: 'PUT',
        body: JSON.stringify({ on: on }),
      }
    );
    return await result.json();
  },

  setColorState: async (lightID, color, modelID) => {
    let xy = convertRGBToXY(color, modelID);
    let bri = approximateBrightness(color);

    const result = await fetch(
      `http://${app.store.config.ip}/api/${app.store.config.key}/lights/${lightID}/state`,
      {
        method: 'PUT',
        body: JSON.stringify({ xy: Object.values(xy), bri: bri }),
      }
    );
    return await result.json();
  },
};

export default Store;
