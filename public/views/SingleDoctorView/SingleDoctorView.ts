import {events} from '../../consts/events';
import {BaseView} from '../BaseView/BaseView';
import {getURLArguments} from '../../modules/router';
import {slider} from '@/utils/slider';
import doctorPageContent from '../../components/doctor/doctor.pug';
import { doctorPageData } from '@/types';
import EventBus from '@/modules/eventBus';
/**
 * @description Класс представления страницы доктора.
 */
export class DoctorView extends BaseView {
  private doctorID: number;
  /**
     * @description Создаёт представление страницы доктора.
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
    const URLArgs = getURLArguments(window.location.pathname, '/doctors/:Id');
    this.eventBus.emit(events.doctorPage.getContent, URLArgs);
  };

  /**
     * @description Отрисовывает контент страницы доктора.
     * @param { Object } doctor Информация об докторе (от имени до фильмографии)
     */
  renderContent = (doctor: doctorPageData) => {
    if (!doctor) {
      return;
    }
    console.log(doctor);
    this.doctorID = doctor.Id;
    const template = doctorPageContent({doctor: doctor});
    const content = document.querySelector('.content');
    if (content) {
      content.innerHTML = template;
      slider('#related-slider');
    } else {
      this.eventBus.emit(events.app.errorPage);
    }
  };
}
