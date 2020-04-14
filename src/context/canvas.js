import { getContext, onMount } from 'svelte';
import { writable, derived } from 'svelte/store';

export const width = writable(0);
export const height = writable(0);
export const pixelRatio = writable(1);
export const context = writable();
export const canvas = writable();
export const time = writable(0);

export const props = deriveObject({
  context,
  canvas,
  width,
  height,
  pixelRatio,
  time
});

export const key = Symbol();

export const renderable = (render) => {
  const api = getContext(key);
  const element = {
    ready: false,
    mounted: false
  };
  if (typeof render === 'function') element.render = render;
  else if (render) {
    if (render.render) element.render = render.render;
    if (render.setup) element.setup = render.setup;
  }
  api.add(element);
  onMount(() => {
    element.mounted = true;
    return () => {
      api.remove(element);
      element.mounted = false;
    };
  });
}

function deriveObject (obj) {
  const keys = Object.keys(obj);
  const list = keys.map(key => {
    return obj[key];
  });
  return derived(list, (array) => {
    return array.reduce((dict, value, i) => {
      dict[keys[i]] = value;
      return dict;
    }, {});
  });
}