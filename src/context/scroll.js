import { getContext, onMount } from 'svelte';

export const key = Symbol();

export const scrollable = ({ value, scroll, enter, exit }) => {
  const api = getContext(key);
  const element = {
    value,
    ready: false,
    mounted: false,
  };
  if (scroll) element.scroll = scroll;
  if (enter) element.enter = enter;
  if (exit) element.exit = exit;
  api.add(element);
  onMount(() => {
    element.mounted = true;
    return () => {
      api.remove(element);
      element.mounted = false;
    };
  });
}
