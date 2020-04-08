export default function splitText(el, {
  wrap = 'span',
  separator = ''
}) {
  return new Promise(resolve => {
    const chars = el.textContent.split(separator);
    const wrapped = chars.map(char =>
      char === ' '
          ? '\n'
          : `<${wrap}>${char}</${wrap}>`
    );
    el.innerHTML = wrapped.join(separator);
    el.setAttribute('data-split', true);
    resolve();
  });
}