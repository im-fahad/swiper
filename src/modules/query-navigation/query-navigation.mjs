import { getDocument, getWindow } from 'ssr-window';
import { elementChildren } from '../../shared/utils.mjs';

export default function QueryNavigation({ swiper, extendParams, emit, on }) {
  let initialized = false;
  const document = getDocument();
  const window = getWindow();
  extendParams({
    queryNavigation: {
      key: 'query',
      enabled: false,
      replaceState: false,
      watchState: false,

      getSlideIndex(_s, query) {
        if (swiper.virtual && swiper.params.virtual.enabled) {
          const slideWithQuery = swiper.slides.filter(
            (slideEl) => slideEl.getAttribute('data-query') === query,
          )[0];
          if (!slideWithQuery) return 0;
          return parseInt(slideWithQuery.getAttribute('data-swiper-slide-index'), 10);
        }
        return swiper.getSlideIndex(
          elementChildren(
            swiper.slidesEl,
            `.${swiper.params.slideClass}[data-query="${query}"], swiper-slide[data-query="${query}"]`,
          )[0],
        );
      },
    },
  });

  const getQueryKey=(search)=>{
    const urlQuery = new URLSearchParams(search);
    return urlQuery.get(swiper.params.queryNavigation.key);
  }
  const onQueryChange = () => {
    emit('queryChange');
    const newQuery = getQueryKey(document.location.search);
    const activeSlideEl =
      swiper.virtual && swiper.params.virtual.enabled
        ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`)
        : swiper.slides[swiper.activeIndex];
    const activeSlideQuery = activeSlideEl ? activeSlideEl.getAttribute('data-query') : '';
    if (newQuery !== activeSlideQuery) {
      const newIndex = swiper.params.queryNavigation.getSlideIndex(swiper, newQuery);
      if (typeof newIndex === 'undefined' || Number.isNaN(newIndex)) return;
      swiper.slideTo(newIndex);
    }
  };
  const setQuery = () => {
    if (!initialized || !swiper.params.queryNavigation.enabled) return;
    const activeSlideEl =
      swiper.virtual && swiper.params.virtual.enabled
        ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`)
        : swiper.slides[swiper.activeIndex];
    const activeSlideQuery = activeSlideEl
      ? activeSlideEl.getAttribute('data-query') || activeSlideEl.getAttribute('data-hash') || activeSlideEl.getAttribute('data-history')
      : '';
    if (
      swiper.params.queryNavigation.replaceState &&
      window.history &&
      window.history.replaceState
    ) {
      window.history.replaceState(null, null, `?${swiper.params.queryNavigation.key}=${activeSlideQuery}` || '');
      emit('querySet');
    } else {
      window.history.pushState(null, null, `?${swiper.params.queryNavigation.key}=${activeSlideQuery}` || '');
      emit('querySet');
    }
  };
  const init = () => {
    if (
      !swiper.params.queryNavigation.enabled ||
      (swiper.params.history && swiper.params.history.enabled)
    )
      return;
    initialized = true;
    const query = getQueryKey(document.location.search);

    if (query) {
      const speed = 0;
      const index = swiper.params.queryNavigation.getSlideIndex(swiper, query);
      swiper.slideTo(index || 0, speed, swiper.params.runCallbacksOnInit, true);
    }
    if (swiper.params.queryNavigation.watchState) {
      window.addEventListener('popstate', onQueryChange);
    }
  };
  const destroy = () => {
    if (swiper.params.queryNavigation.watchState) {
      window.removeEventListener('popstate', onQueryChange);
    }
  };

  on('init', () => {
    if (swiper.params.queryNavigation.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.queryNavigation.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setQuery();
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setQuery();
    }
  });
}
