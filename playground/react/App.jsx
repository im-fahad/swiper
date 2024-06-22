/* eslint-disable no-restricted-globals */
import React from 'react';
// eslint-disable-next-line
import {
  A11y,
  Navigation,
  Pagination,
  Scrollbar,
  Mousewheel,
  QueryNavigation,
} from 'swiper/modules';
// eslint-disable-next-line
import { Swiper, SwiperSlide } from 'swiper/swiper-react';

const App = () => {
  return (
    <main>
      <Swiper
        modules={[Pagination, Mousewheel, Navigation, Scrollbar, QueryNavigation]}
        onSwiper={(swiper) => (window.swiper = swiper)}
        slidesPerView={1}
        threshold={2}
        spaceBetween={10}
        navigation={true}
        scrollbar
        mousewheel={{ forceToAxis: true, sensitivity: 0.1, releaseOnEdges: true }}
        pagination={{ clickable: true }}
        queryNavigation={{
          enabled: true,
          key: 'product',
          watchState: true,
        }}
      >
        <SwiperSlide data-query="1123">Slide 1</SwiperSlide>
        <SwiperSlide data-query="2222">Slide 2</SwiperSlide>
        <SwiperSlide data-query="3333">Slide 3</SwiperSlide>
        <SwiperSlide data-query="4343">Slide 4</SwiperSlide>
        <SwiperSlide data-query="5343">Slide 5</SwiperSlide>
      </Swiper>
    </main>
  );
};

export default App;
