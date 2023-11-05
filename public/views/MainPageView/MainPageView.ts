import {BaseView} from '../BaseView/BaseView';
import {events} from '../../consts/events';
import collectionsContent from '../../components/mainPage/mainPage.pug';
import EventBus from '@/modules/eventBus.js';

/**
 * @description Класс представления страницы подборок
 */
export class MainPageView extends BaseView {
  moviesData: object;
  /**
   * @description Создаёт представление страницы подборок.
   * @param { EventBus } eventBus Глобальная шина событий
   * @param { Object } data Данные, необходимые для создания представления
   */
  constructor(eventBus: EventBus, data : object = {}) {
    super(eventBus, data);
  }

  /**
   * @description Отправляет на глобальную шину событий событие отрисовки
   * контента страницы.
   */
  emitGetContent = () => {
    this.eventBus.emit(events.collectionsPage.getContent);
  };

  initCarousel = () => {
    const slidesContainer = document.getElementById("slides-container") as HTMLDivElement;
    const slide = document.querySelector(".slide") as HTMLDivElement;
    const prevButton = document.getElementById("slide-arrow-prev") as HTMLButtonElement;
    const nextButton = document.getElementById("slide-arrow-next") as HTMLButtonElement;
    if (!slidesContainer || !slide || !prevButton || !nextButton) {
      setTimeout(this.initCarousel, 1000);
      return;
    }

    nextButton.addEventListener("click", () => {
      const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft += slideWidth;
    });

    prevButton.addEventListener("click", () => {
      const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft -= slideWidth;
    });
  }

  /**
   * @description Отрисовывает контент страницы подборок.
   * @param { Object } data Данные для отрисовки контента подборок фильмов:
   * массив подборок
   */
  renderContent = (data: object) => {
    const template = collectionsContent();
    this.initCarousel();
    this.moviesData = data;
    const content = document.querySelector('.content');
    if (content) {
      content.innerHTML = template;
    } else {
      this.eventBus.emit(events.app.errorPage);
    }
  };
}
