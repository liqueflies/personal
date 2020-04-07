export default function isElementInViewport (el) {
  const rect = el.getBoundingClientRect();
  return rect.bottom >= 0;
}