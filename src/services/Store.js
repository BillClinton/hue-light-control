import API from './API.js';
import { convertRGBToXY, approximateBrightness } from '../services/Util.js';

const Store = {
  lights: {},
  rooms: {},

  loadAll: async () => {
    let response = await Promise.all([API.fetchLights(), API.fetchRooms()]);
  },

  getLight: (lightID) => {
    return app.store.lights[lightID] || null;
  },

  setOnState: async (lightID, on = true) => {
    const result = await fetch(
      `${API.domain}/api/${API.token}${API.path}/${lightID}/state`,
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
      `${API.domain}/api/${API.token}${API.path}/${lightID}/state`,
      {
        method: 'PUT',
        body: JSON.stringify({ xy: Object.values(xy), bri: bri }),
      }
    );
    return await result.json();
  },
};

export default Store;
