import { getContext, onMount } from 'svelte';

export const key = Symbol();

export const swipable = (run) => {
  const api = getContext(key);
  const element = {
    ready: false,
    mounted: false,
  };
  if (run) element.run = run;
  api.add(element);
  onMount(() => {
    element.mounted = true;
    return () => {
      api.remove(element);
      element.mounted = false;
    };
  });
}
