export function lerp(min, max, fraction) {
  return (max - min) * fraction + min
}