import { useMediaQuery } from "@vueuse/core";
import { computed } from "vue";

const isSm = useMediaQuery('(width < 640px)');
const isSmOrMore = useMediaQuery('(width >= 0px)');
const isMd = useMediaQuery('(width >= 640px) and (width < 768px)');
const isMdOrMore = useMediaQuery('(width >= 640px)');
const isLg = useMediaQuery('(width >= 768px) and (width < 1024px)');
const isLgOrMore = useMediaQuery('(width >= 768px)');
const isXl = useMediaQuery('(width >= 1024px) and (width < 1280px)');
const isXlOrMore = useMediaQuery('(width >= 1024px)');
const isXxl = useMediaQuery('(width >= 1280px)');
const isXxlOrMore = useMediaQuery('(width >= 1280px)');

const mediaSize = computed<'sm' | 'md' | 'lg' | 'xl' | 'xxl'>(() => {
  if (isSm.value) return 'sm'
  if (isMd.value) return 'md'
  if (isLg.value) return 'lg'
  if (isXl.value) return 'xl'
  if (isXxl.value) return 'xxl'
  return 'sm'
})

export default function () {



  return {
    isSm,
    isSmOrMore,
    isMd,
    isMdOrMore,
    isLg,
    isLgOrMore,
    isXl,
    isXlOrMore,
    isXxl,
    isXxlOrMore,
    mediaSize
  }
}