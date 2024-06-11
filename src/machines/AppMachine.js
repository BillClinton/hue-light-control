// import {
//   assign,
//   createMachine,
//   fromPromise,
// } from 'https://cdn.skypack.dev/xstate@5.13.1';
import { assign, createMachine, fromPromise } from 'xstate';
import { convertXYToRGB } from '../services/Util.js';

const AppMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgNwBcBiCAe0LPwDdaBrMRy3dAGwBla6CABF0FdAG0ADAF1EoAA61YXevJAAPRAGYA7FJIAOAKxSpARgCcAFgBMU7cd26ANCACeiSwcump93Ss7QO0AX1C3NCw8QlJyajAAJ0TaRJIFHjEAM1TUTgpufkERMUlZdSUVArUkTR19Iz8g+0dnN08Ecz0SADYmnp7ra0NdQyke8MiMHAJiEkSwIXcqWDAKEnoSWHEKMGk5WsrVfHUtBDtzI3NbY3MnHt0e83MpY3bEawGSa0tfsyHnFJrLpJiAojNYvNFhBlqt1phaDxUlsdntyodlMdTh8gSRbD0bl0epYbuMeu8EH1jHifrpLINdNZzKNjKDwTE5gsllQkUJ9hVMdUTrUzsDdCQnKZbNZtC8pJZtOSPIhzIZrCRHGZrk4HLZLGzphzSABXBQQMQEKAAeXwAGVUTR6BwCCx2Fs1jb7WI0QdFILcDVQGc9AYTFqbC0nK5lQhtLZxUNfoFjJYTPTdGEImDDbMTWaLfhrXaHUkUmkMtlcu6KJ7UfyMVUA8Kg-VQ00Iw4oxSmZYSHS-tZjLZh8Y9CCs+zcyRTeaCoWAMKI1Je3aOhgutgcOGLpGJFc+gWNwN1WMNMMWDutaMdW49EhWVMPAmmfSsic5yEzgtQHfLkvJZEKwoHJEjybclz3Ot0T9I9mxPENGnDOxOzaGMeikQwJR+MZXmGXR4wmd9oinXkIEtNdnWYTcSFI+sYKxEVW0Qi9kKvClbG0dUgSTSxGUeGxDEIqZiMhUjyNLQDMmAqtaOgkAjiFbFTzbJDI1QjpbDGPsfl44wHllQdDHCLN8FoCA4HUSdYkPBiWwQABaJUOkckgzDc9z3JlA0RLmeIbMUxjKXVBVGV8Ho40HYIKUMS5tHculrH8BxfG8iFOWhDp6ICuynlDEYhxuW5dOvHRPg1UKhk0l44yMoi0rzWdLVrb1-KbJT8L7XQ-FvYdfFsbsOPvaVBM+OxiRTVKjWnfM5x-CD91a49RX6tDniMRlDE2wd0NVfU6qmsTC0WuCzm1Ps9FMbQDLiwxpXYq7ysu+VzDsQxvEzcIgA */
    initial: 'init',
    context: { lights: [] },
    states: {
      init: {
        invoke: {
          id: 'initialLoadData',
          src: 'loadData',
          onDone: 'ready',
          onError: 'ready',
        },
        exit: ['initControls'],
      },
      ready: {
        on: {
          'set.on.state': {
            target: 'updatingOnState',
          },
          'set.color.state': {
            target: 'updatingColorState',
          },
          load: {
            target: 'loading',
          },
        },
      },
      updatingOnState: {
        invoke: {
          id: 'setOnState',
          src: 'setOnState',
          input: ({ context, event }) => ({ context, event }),
          onDone: {
            target: 'ready',
            actions: 'updateState',
          },
          onError: 'ready',
        },
      },
      updatingColorState: {
        invoke: {
          id: 'setColorState',
          src: 'setColorState',
          input: ({ context, event }) => ({ context, event }),
          onDone: {
            target: 'ready',
            actions: 'updateState',
          },
          onError: 'ready',
        },
      },
      loading: {
        invoke: {
          id: 'load',
          src: 'loadStore',
          onDone: 'ready',
          onError: 'ready',
        },
      },
    },
  },
  {
    actions: {
      updateState: ({ context, event }) => {
        const response = event.output;
        if (Array.isArray(response)) {
          // loop through the response array to handle multiple response
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
                var LightControls = context.lights.filter((light) => {
                  return light.lightId === lightId;
                });

                // update the state of all the light buttons with matching Hue id
                for (let i = 0; i < LightControls.length; i++) {
                  const LightControl = LightControls[i];
                  const currentState = JSON.parse(
                    LightControl.light.dataset.state
                  );

                  // update the state of the light button
                  console.log(
                    `updating ${key} to ${val} for light id: ${lightId} `
                  );
                  const updateState = currentState;
                  updateState[key] = val;

                  LightControl.light.dataset.state =
                    JSON.stringify(updateState);
                  LightControl.light.render();
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
        } else {
          console.warn(
            'Invalid input while setting light state.  Expected array of response objects'
          );
        }
      },
      initControls: assign(({ context }) => {
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
            const color = convertXYToRGB(state.xy[0], state.xy[1], state.bri);

            control.dataset.systemId = systemId;
            control.dataset.state = JSON.stringify(state);
            control.dataset.name = lightData.name;
            control.dataset.color = color;
            control.dataset.modelid = lightData.modelid;

            controls.push({ lightId, systemId, control });
            console.log('control', control);
            control.render();
          }
        }
        // return the context with the new lights array
        return { ...context, controls };
      }),
    },
    actors: {
      loadData: fromPromise(async () => await app.store.loadAll()),
      setOnState: fromPromise(async ({ input: { context, event } }) => {
        // Get the light button that was clickedfrom context by systemID
        const button = context.lights.find(
          (item) => item.systemId === event.systemId
        );

        // Set the `on` state and return the response
        return await app.store.setOnState(button.light.dataset.id, event.on);
      }),
      setColorState: fromPromise(async ({ input: { context, event } }) => {
        // Get the light button that was clickedfrom context by systemID
        const button = context.lights.find(
          (item) => item.systemId === event.systemId
        );

        // Set the `color` state and return the response
        return await app.store.setColorState(
          button.light.dataset.id,
          event.color,
          button.light.dataset.modelId
        );
      }),
    },
  }
);

export default AppMachine;
