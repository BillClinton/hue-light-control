const System = {
  context: {
    controls: [],
  },

  start: async () => {
    document.addEventListener('hue-set-on', async (e) => {
      const response = await app.system.setOnState(e.detail);
      app.system.updateState(response);
    });

    document.addEventListener('hue-set-color', async (e) => {
      const response = await app.system.setColorState(e.detail);
      if (e.detail.update) {
        app.system.updateState(response);
      }
    });

    await app.system.loadData();
    app.system.initControls();
  },

  loadData: async () => await app.store.loadAll(),

  initControls: () => {
    // collect all the light-control elements from the DOM
    const LightControlList = document.querySelectorAll('light-control');
    const controls = [];

    // Loop through the light elements
    for (let i = 0; i < LightControlList.length; i++) {
      const control = LightControlList[i];
      const lightId = control.dataset.id;
      const systemId = crypto.randomUUID();
      const lightData = app.store.getLight(lightId);

      if (!lightId) {
        console.warn(
          `<light-control> elements must have a 'data-id' with the value of the Hue light ID.`
        );
      } else {
        // Set light dataset
        const state = lightData.state;
        // const color = convertXYToRGB(state.xy[0], state.xy[1], state.bri);

        control.dataset.systemId = systemId;
        control.dataset.state = JSON.stringify(state);
        control.dataset.name = lightData.name;
        control.dataset.modelid = lightData.modelid;

        controls.push({ lightId, systemId, control });
        control.render();
      }
    }
    // set the new controls array
    app.system.context.controls = controls;
  },

  updateState: (response) => {
    if (Array.isArray(response)) {
      const updatedControls = {};

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
            // get all buttons that share the same Hue id
            var LightControls = app.system.context.controls.filter(
              (control) => {
                return control.lightId === lightId;
              }
            );

            // update the state of all the light buttons with matching Hue id
            for (let i = 0; i < LightControls.length; i++) {
              const LightControl = LightControls[i];
              const currentState = JSON.parse(
                LightControl.control.dataset.state
              );

              // update the state of the light button
              // console.log(
              //   `updating ${key} to ${val} for light id: ${lightId} `
              // );
              const updateState = currentState;
              updateState[key] = val;

              LightControl.control.dataset.state = JSON.stringify(updateState);
              updatedControls[LightControl.systemId] = LightControl.control;
            }
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
      // Remove duplicates and render the updated controls
      Object.keys(updatedControls).forEach((key) => {
        updatedControls[key].render();
      });
    } else {
      console.warn(
        'Invalid input while setting light state.  Expected array of response objects'
      );
    }
  },

  setOnState: async ({ systemId, on }) => {
    // look up control in the context.controls array by systemId
    const light = app.system.context.controls.find(
      (item) => item.systemId === systemId
    );

    // Set the `on` state and return the response
    return await app.store.setOnState(light.control.dataset.id, on);
  },

  setColorState: async ({ systemId, color }) => {
    // look up control in the context.controls array by systemId
    const light = app.system.context.controls.find(
      (item) => item.systemId === systemId
    );

    // Set the `color` state and return the response
    return await app.store.setColorState(
      light.control.dataset.id,
      color,
      light.control.dataset.modelId
    );
  },
};

export default System;
