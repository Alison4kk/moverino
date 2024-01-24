import useEventBus from "./useEventBus";

const {eventBus} = useEventBus();

export function useLoading() {
  const show = () => eventBus.emit('set-loading', true);
  const hide = () => eventBus.emit('set-loading', false);
  const setState = (state: boolean) => eventBus.emit('set-loading', state);

  return {
    show,
    hide,
    setState
  }
}