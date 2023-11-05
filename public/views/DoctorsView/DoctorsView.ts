import { singleCollectionPageData } from '@/types';
import EventBus from '@/modules/eventBus';
import {events} from '@/consts/events';
import {BaseView} from '../BaseView/BaseView';
import doctorsContent from '@/components/doctors/doctors.pug';

/**
 * @description Класс представления страницы докторов.
 */
export class DoctorsView extends BaseView {
  constructor(eventBus: EventBus, {data={}} = {}) {
    super(eventBus, data);
  }

  /**
     * @description Отправляет на глобальную шину событий событие отрисовки
     * контента страницы.
     */
  emitGetContent = () => {
    this.eventBus.emit(events.doctorsPage.getContent);
  };

  /**
     * @description Отрисовывает контент страницы докторов.
     * @param { Object } data Данные для отрисовки контента докторов
     */
  renderContent = (data: singleCollectionPageData) => {
    const template = doctorsContent(data);
    const content = document.querySelector('.content');
    if (content) {
      content.innerHTML = template;
    } else {
      this.eventBus.emit(events.app.errorPage);
    }
  };
}
