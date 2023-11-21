import { singleCollectionPageData } from '@/types';
import EventBus from '@/modules/eventBus';
import {events} from '@/consts/events';
import {BaseView} from '../BaseView/BaseView';
import roomContent from '@/components/room/room.pug';

/**
 * @description Класс представления страницы палат.
 */
export class RoomView extends BaseView {
  private moviesData: singleCollectionPageData;

  /**
     * @description Создаёт представление страницы палат.
     * @param { EventBus } eventBus Глобальная шина событий
     * @param { Object } data Данные, необходимые для создания представления
     */
  constructor(eventBus: EventBus, {data={}} = {}) {
    super(eventBus, data);
  }

  /**
     * @description Отправляет на глобальную шину событий событие отрисовки
     * контента страницы.
     */
  emitGetContent = () => {
    this.eventBus.emit(events.singleCollectionPage.getContent);
  };

  /**
     * @description Отрисовывает контент страницы палат.
     * @param { Object } data Данные для отрисовки контента:
     */
  renderContent = (data: singleCollectionPageData) => {
    const template = roomContent({roomlist: data});
    this.moviesData = data;
    const content = document.querySelector('.content');
    if (content) {
      content.innerHTML = template;
    } else {
      this.eventBus.emit(events.app.errorPage);
    }
  };
}
