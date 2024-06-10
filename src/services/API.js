import { convertRGBToXY, approximateBrightness } from '../services/Util.js';

const API = {
  domain: 'http://192.168.1.164', // the local IP address of your Hue bridge
  token: 'KD505fvPjVuRGxZoqq7Q7hSN6k-eabB8aoS46Bou', // put your token here
  path: '/lights',

  fetchLights: async () => {
    const result = await fetch(`${API.domain}/api/${API.token}${API.path}`);
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
    const result = await fetch(`${API.domain}/api/${API.token}/groups`);
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

  setOnState: async (lightID, on = true) => {
    const result = await fetch(
      `${API.domain}/api/${API.token}${API.path}/${lightID}/state`,
      {
        method: 'PUT',
        body: JSON.stringify({ on: on }),
      }
    );
    const response = await result.json();
    const onState = response[0].success[`/lights/${lightID}/state/on`];

    const lights = app.store.lights;
    for (const key in lights) {
      if (lights.hasOwnProperty(key)) {
        if (key === lightID) {
          lights[key].state.on = onState;
        }
      }
    }
    app.store.lights = lights;
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
    return await result.json();

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
    // return { xy, bri };
  },
};

export default API;
