import mitt from "mitt";

const eventBus = mitt();



export default function useEventBus() {return {eventBus}}
