export function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return true;

  for (let element: HTMLElement | null = target; element; element = element.parentElement) {
    const contentEditable = element.getAttribute('contenteditable');

    if (contentEditable === 'false') return false;
    if (contentEditable === '' || contentEditable === 'true') return true;

    // JSDOM does not consistently reflect the contentEditable property to the
    // attribute, so support the property as well as the browser attribute.
    if (element.contentEditable === 'false') return false;
    if (element.contentEditable === 'true' || element.isContentEditable) return true;
  }

  return false;
}
