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
    const response = await result.json();
    if (response[0].success) {
      return response;
    }
  },

  setColorState: async (lightID, color, modelID, updateStore) => {
    let xy = convertRGBToXY(color, modelID);
    let bri = approximateBrightness(color);

    const result = await fetch(
      `${API.domain}/api/${API.token}${API.path}/${lightID}/state`,
      {
        method: 'PUT',
        body: JSON.stringify({ xy: Object.values(xy), bri: bri }),
      }
    );
    const response = await result.json();
    // console.log('setColorState Response', response);

    // xy = response[0].success[`/lights/${lightID}/state/xy`];
    // bri = response[1].success[`/lights/${lightID}/state/bri`];

    // if (updateStore) {
    //   xy = response[0].success[`/lights/${lightID}/state/xy`];
    //   bri = response[1].success[`/lights/${lightID}/state/bri`];

    //   const lights = app.store.lights;
    //   for (const key in lights) {
    //     if (lights.hasOwnProperty(key)) {
    //       if (key === lightID) {
    //         const light = lights[key];
    //         light.state.xy = xy;
    //         light.state.bri = bri;
    //         const updated = { ...lights, [key]: light };
    //         app.store.lights = updated;
    //       }
    //     }
    //   }
    // }

    return response;
  },
};

export default Store;
