import { KEY_CODE_ESCAPE } from './../core/constants/ui';

export function escapePressed(event: KeyboardEvent) {
  return event.key === 'Escape' || event.keyCode === KEY_CODE_ESCAPE;
}
