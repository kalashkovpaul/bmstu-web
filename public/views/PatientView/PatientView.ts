import {bookmarkRequest, patientPageData, personalCollectionItem, review, treatment } from '@/types';
import EventBus from '@/modules/eventBus';
import {BaseView} from '../BaseView/BaseView';
import {events} from '@/consts/events';
import {getURLArguments} from '@/modules/router';
import {authModule} from '@/modules/auth';
import {createElementFromHTML} from '@/utils/utils';
import patientPageContent from '@/components/patient/patient.pug';
import reviewInvitation from '@/components/reviewInvitation/reviewInvitation.pug';
import reviewInputBlock from '@/components/reviewInputBlock/reviewInputBlock.pug';
import reviewSuccessBlock from '@/components/reviewSuccessBlock/reviewSuccessBlock.pug';
import createReviewCard from '@/components/reviewCard/createReviewCard.pug';
import collectionDropdown from '@/components/collectionDropdown/collectionDropdown.pug';

/**
 * @description Класс представления страницы одного пациента
 */
export class PatientView extends BaseView {
  private patientId: string;
  private collectionsInfo: personalCollectionItem[];
  private reviewEx = false;
  /**
     * @description Создаёт представление страницы одного пациента.
     * @param { EventBus } eventBus Глобальная шина событий
     * @param { Object } data Данные, необходимые для создания представления
    */
  constructor(eventBus: EventBus, {data = {}} = {}) {
    super(eventBus, data);
  }

  /**
     * @description Отправляет на глобальную шину событий событие отрисовки
     * контента страницы.
     */
  emitGetContent = () => {
    const URLArgs = getURLArguments(window.location.pathname, '/patients/:Id');
    this.eventBus.emit(events.patientPage.getContent, URLArgs);
  };

  /**
     * @description Отрисовывает контент страницы пациенте.
     * @param { Object } data Информация о пациенте
     */
  renderContent = (data: patientPageData) => {
    if (!data) {
      return;
    }
    this.patientId = data.Id;
    console.log(data);
    const template = patientPageContent({patient: data});
    const content = document.querySelector('.content');
    if (content) {
      content.innerHTML = template;
      this.renderReviewInput(data.Id);
      this.renderDeleteClient();
      // this.renderCollectionsArea(data.collectionsInfo);
      // this.eventBus.emit(events.patientPage.reviewSuccess);
    } else {
      this.eventBus.emit(events.app.errorPage);
    }
  };

  renderDeleteClient = () => {
    const button = document.querySelector('.trailer__btn');
    if (!button) {
      window.setTimeout(this.renderDeleteClient, 500);
      return;
    }
    button?.addEventListener('click', () => {
      this.eventBus.emit(events.patientPage.deletePatient, this.patientId);
    });
  };

  /**
     * @description Отрисовывает панель рейтинга и навешивает все необходимые
     * обработчики (для динамического изменения рейтинга).
     * @param { string } movieID ID текущего пациента
     */
  renderRating = (movieID: string) => {
    const rating = document.querySelector('.stars') as HTMLElement;
    const ratingItems: HTMLElement[] = Object.values(
      document.querySelectorAll('.stars__item__single-star')) ;
    rating.addEventListener('click', (e) => {
      if (!authModule) {
        e.preventDefault();
      }
      const target = e.target as HTMLElement;
      if (target.classList.contains('stars__item__single-star')) {
        removeClass('current-active');
        target.classList.add('active', 'current-active');
        const rating = {
          myRating: target.getAttribute('rating'),
          ID: authModule?.user?.Id,
        };
        this.eventBus.emit(events.patientPage.sendRating, movieID, rating.myRating);
      }
    });

    rating.onmouseover = function(e) {
      const target = e.target as HTMLElement;
      if (target.classList.contains('stars__item__single-star')) {
        removeClass('active');
        target.classList.add('active');
        mouseOverActive(ratingItems);
      }
    };

    rating.onmouseout = function() {
      addClass('active');
      mouseOutOfActive(ratingItems);
    };

    /**
     * @description Убирает переданный класс c элементов-звёзд.
     * @param { string } removableClass
     */
    function removeClass(removableClass: string) {
      for (let i = 0, len = ratingItems.length; i < len; i++) {
        ratingItems[i].classList.remove(removableClass);
      }
    }
    /**
     * @description Добавляет переданный класс элементам-звёздам.
     * @param { string } addbleClass
     */
    function addClass(addbleClass: string) {
      for (let i = 0, len = ratingItems.length; i < len; i++) {
        ratingItems[i].classList.add(addbleClass);
      }
    }

    /**
     * @description Помещает все переданные элементы активными.
     * @param { HTMLElement[] } items Массив элементов
     */
    function mouseOverActive(items: HTMLElement[]) {
      for (let i = 0, len = items.length; i < len; i++) {
        if (items[i].classList.contains('active')) {
          break;
        } else {
          items[i].classList.add('active');
        }
      }
    }

    /**
     * @description Помещает все переданные элементы неактивными.
     * @param { HTMLElement[] } items Массив элементов
     */
    function mouseOutOfActive(items: HTMLElement[]) {
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].classList.contains('current-active')) {
          break;
        } else {
          items[i].classList.remove('active');
        }
      }
    }
  };

  /**
     * @description Выводит сообщение о просьбе зарегистрироваться.
     * @param { string } movieID ID текущего пациента.
     */
  askToLog = () => {
    const messageArea = document.querySelector('.user-rating') as HTMLElement;
    messageArea.innerHTML = `
        Чтобы поставить оценку, пожалуйста,&nbsp
        <a class = "white_text"" href="/register">
        зарегистрируйтесь</a>`;
  };

  /**
     * @description Отображает оставленную пользователем оценку,
     * обновляет глобальную оценку.
     * @param { string } myRating Оставленная оценка
     * @param { string } movieRating Глобальная оценка пациента
     */
  onRatingSuccess = (myRating: string, movieRating: string) => {
    const messageArea = document.querySelector('.user-rating') as HTMLElement;
    messageArea.innerHTML = `Ваша оценка: ${myRating}. Рейтинг пациента: ${movieRating}`;
    const shortRating = document.querySelector('.short-rating') as HTMLElement;
    shortRating.textContent = `${movieRating}`;
  };

  /**
     * @description Отрисовывает область оставления отзыва.
     * @param { string } movieID ID текущего пациента
     */
  renderReviewInput = (movieID: string) => {
    const reviewInput = document.querySelector('.send-review__input');
    if (!reviewInput) {
      return;
    }
    if (authModule?.user) {
      reviewInput.innerHTML = reviewInputBlock();
      this.addReviewInputListeners();
    } else {
      reviewInput.innerHTML = reviewInvitation({movieID: movieID});
    }
  };

  /**
   *
   */

  /**
     * @description Добавляет обработчики событий на dropdown.
     */
  addReviewInputListeners = () => {
    const dropdown = document.getElementsByClassName('review-input-block__dropdown');
    const choiceAmount = dropdown.length;
    for (let i = 0; i < choiceAmount; i++) {
      const curentSelect = dropdown[i].getElementsByTagName('select')[0];
      const currentSelectLength = curentSelect.length;
      const div = document.createElement('div');
      div.setAttribute('class', 'select-selected');
      div.innerHTML = curentSelect.options[curentSelect.selectedIndex].innerHTML;
      dropdown[i].appendChild(div);

      const optionListContainer = document.createElement('div');
      optionListContainer.setAttribute('class', 'select-items select-hide');
      for (let j = 1; j < currentSelectLength; j++) {
        const optionItem = document.createElement('div');
        if (j == currentSelectLength - 1) {
          optionItem.classList.add('last');
        }
        optionItem.innerHTML = curentSelect.options[j].innerHTML;
        optionItem.addEventListener('click', this.dropdownEventListener);
        optionListContainer.appendChild(optionItem);
      }
      dropdown[i].appendChild(optionListContainer);
      div.addEventListener('click', function(e) {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const next = target.nextSibling as HTMLElement;
        next?.classList.toggle('select-hide');
        target.classList.toggle('select-arrow-active');
      });
    }

    const submitButton = document.querySelector('.review-input-block__submit') as HTMLElement;
    submitButton.addEventListener('click', this.sendReview);
  };

  /**
     * @description Когда происходит нажатие элемента dropdown-a,
     * обновляет исходный dropdown и отмечает элемент как выбранный.\
     * @param { Event } e Событие нажатия
     */
  dropdownEventListener = (e: Event) => {
    const target = e.target as HTMLElement;
    const currentSelect = target?.parentElement?.parentElement?.getElementsByTagName('select')[0];
    const currentSelectLength = currentSelect?.length;
    const previousSelect = target.parentNode?.previousSibling as HTMLElement;
    if (!currentSelect || !currentSelectLength || !previousSelect) { return; }
    for (let i = 0; i < currentSelectLength; i++) {
      if (currentSelect.options[i].innerHTML == target.innerHTML) {
        currentSelect.selectedIndex = i;
        previousSelect.innerHTML = 'Выбор: ' + target.innerHTML;
        const previousSameAsSelected = target.parentElement.getElementsByClassName('same-as-selected');
        const previousLength = previousSameAsSelected.length;
        for (let k = 0; k < previousLength; k++) {
          previousSameAsSelected[k].classList.toggle('same-as-selected');
        }
        target.classList.add('same-as-selected');
        break;
      }
    }
    previousSelect.click();
  };

  /**
     * @description Закрывает все элементы в dropdown-e, кроме выбранного.
     * @param { HTMLElement } element Выбранный элемент.
     */
  closeAllSelect = (event: Event) => {
    const element = event.target;
    const items = document.getElementsByClassName('select-items');
    const selected = document.getElementsByClassName('select-selected');
    const itemsAmount = items.length;
    const selectedAmount = selected.length;
    const elementsToHide = [];
    for (let i = 0; i < selectedAmount; i++) {
      if (element == selected[i]) {
        elementsToHide.push(i);
      } else {
        selected[i].classList.remove('select-arrow-active');
      }
    }
    for (let i = 0; i < itemsAmount; i++) {
      if (elementsToHide.indexOf(i)) {
        items[i].classList.add('select-hide');
      }
    }
  };

  /**
   * @description Собирает данные для оставления отзыва и отправляет их в модель.
   */
  sendReview = () => {
    const input = document.querySelector('.review-input-block__text-input') as HTMLFormElement;
    const reviewText = input.value;
    const reviewTypeText = document.querySelector('.select-selected')?.textContent;
    let reviewType = 2;
    if (reviewTypeText?.includes('Лекарства')) {
      reviewType = 1;
    } else if (reviewTypeText?.includes('Опрос')) {
      reviewType = 2;
    } else if (reviewTypeText?.includes('Вывод')) {
      reviewType = 3;
    }
    const review = {
      PatientNumber: this.patientId,
      UpdateAt: `${Date.now()}`,
      Tablets: reviewType === 1 ? reviewText : "",
      Survey: reviewType === 2 ? reviewText : "",
      PsychologicalTreatment: reviewType === 3 ? reviewText : "",
    };
    this.eventBus.emit(events.patientPage.sendReview, review);
  };

  /**
     * @description Отображает результат отправления отзыва.
     * @param { object } review Сформированный отзыв
     */
  renderReviewSuccess = (review: treatment) => {
    // const reviewInput = document.querySelector('.send-review__input') as HTMLElement;
    // reviewInput.innerHTML = reviewSuccessBlock();

    const reviewList = document.querySelector('.review-list');
    // if (!review) {
    //   return;
    // }
    reviewList?.append(<HTMLElement>createElementFromHTML(
      <string> createReviewCard({singleReview: {
          ...review,
          Tablets: `Лекарства: ${review.Tablets}`,
          UpdateAt: `${Intl.DateTimeFormat('ru-RU').format(new Date(review.UpdateAt))}`,
          Survey: `Опрос: ${review.Survey}`,
          PsychologicalTreatment: `Вывод: ${review.PsychologicalTreatment}`,
        }
      })
    ));
  };

  /**
     * @description Убирает информацию, которая находится только на странице
     * авторизованного пользователя.
     */
  onLogout = () => {
    const reviewInput = document.querySelector('.send-review__input');
    const messageArea = document.querySelector('.user-rating');
    const collectionsArea = document.querySelector(".movie-collection");
    if (!reviewInput || !messageArea || !collectionsArea) {
      return;
    }
    messageArea.innerHTML = ``;
    collectionsArea.innerHTML = ``;
    reviewInput.innerHTML = reviewInvitation({movieID: this.patientId});
  };

  renderCollectionsArea = (collectionsInfo: personalCollectionItem[]) => {
    const collectionsArea = document.querySelector(".movie-collection");
    if (!collectionsArea) { return; }
    if (authModule.user) {
      collectionsArea.innerHTML = collectionDropdown({ collectionsInfo: collectionsInfo });
      this.addCollectionsAreaListeners();
    }
  }

  addCollectionsAreaListeners = () => {
    const dropdown = document.getElementsByClassName('movie-collection__dropdown');
    const choiceAmount = dropdown.length;
    for (let i = 0; i < choiceAmount; i++) {
      const currentSelect = dropdown[i].getElementsByTagName('select')[0];
      const currentSelectLength = currentSelect.length;
      const div = document.createElement('div');
      div.setAttribute('class', 'select-selected-collections');
      div.textContent = currentSelect.options[currentSelect.selectedIndex].innerHTML;
      dropdown[i].appendChild(div);

      const optionListContainer = document.createElement('div');
      optionListContainer.setAttribute('class', 'select-items bookmark-items select-hide');
      for (let j = 1; j < currentSelectLength - 1; j++) {
        const optionItem = document.createElement('label');

        const checkbox = document.createElement('input') ;
        checkbox.setAttribute('type', 'checkbox');

        if (j == currentSelectLength - 1) {
          optionItem.classList.add('last');
        }
        if (currentSelect.options[j].classList.contains("hasMovie")) {
          optionItem.classList.add("hasMovie");
          checkbox.checked = true;
        }
        const bookmarkId = currentSelect.options[j].getAttribute("bookmarkid");
        optionItem.setAttribute("bookmarkid", bookmarkId ? bookmarkId : "");
        optionItem.textContent = currentSelect.options[j].innerHTML;
        optionItem.addEventListener('click', this.collectionsDropdownListener);


        optionItem.appendChild(checkbox);
        const customCheckbox = document.createElement("span");
        customCheckbox.setAttribute('class', "custom-checkbox");
        optionItem.appendChild(customCheckbox);
        optionListContainer.appendChild(optionItem);
      }
      const lastItem = document.createElement('label');
      lastItem.classList.add("collections-last");
      const bookmarkId = currentSelect.options[currentSelectLength - 1].getAttribute("bookmarkid");
      lastItem.setAttribute("bookmarkid", bookmarkId ? bookmarkId : "");
      const text = currentSelect.options[currentSelectLength - 1].innerHTML
      lastItem.textContent = text.length > 22 ? text.slice(0, 18) + "..." : text;
      lastItem.addEventListener('click', this.collectionsDropdownListener);

      const checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      if (currentSelect.options[currentSelectLength - 1].classList.contains("hasMovie")) {
        lastItem.classList.add("hasMovie");
        checkbox.checked = true;
      }
      lastItem.appendChild(checkbox);

      const customCheckbox = document.createElement("span");
      customCheckbox.setAttribute('class', "custom-checkbox");
      lastItem.appendChild(customCheckbox);

      optionListContainer.appendChild(lastItem);
      dropdown[i].appendChild(optionListContainer);
      div.addEventListener('click', function(e) {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const next = target.nextSibling as HTMLElement;
        next?.classList.toggle('select-hide');
        target.classList.toggle('select-arrow-active');
      });
    }
  };

  collectionsDropdownListener = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.textContent) { return; }
    const currentSelect = target?.parentElement?.parentElement?.getElementsByTagName('select')[0];
    const currentSelectLength = currentSelect?.length;
    const previousSelect = target.parentNode?.previousSibling as HTMLElement;
    if (!currentSelect || !currentSelectLength || !previousSelect) { return; }
    for (let i = 0; i < currentSelectLength; i++) {
      if (currentSelect.options[i].innerHTML == target.textContent) {
        currentSelect.selectedIndex = i;
        const bookmarkId = target.getAttribute("bookmarkid");
        const bookmarkRequest: bookmarkRequest = {
          movieId: this.patientId,
          bookmarkId: bookmarkId ? bookmarkId : "",
        }
        if (target.classList.contains("hasMovie")) {
          previousSelect.innerHTML = 'Добавить в подборку: ';
          this.eventBus.emit(events.patientPage.removeCollection, bookmarkRequest);
        }
        else {
          this.eventBus.emit(events.patientPage.addCollection, bookmarkRequest);
        }
        const previousSameAsSelected = target.parentElement.getElementsByClassName('same-as-selected');
        const previousLength = previousSameAsSelected.length;
        for (let k = 0; k < previousLength; k++) {
          previousSameAsSelected[k].classList.toggle('same-as-selected');
        }
        target.classList.add('same-as-selected');
        target.classList.toggle('hasMovie');
        break;
      }
    }
  };

  newCollectionListener = (e: Event) => {
    const target = e.target as HTMLElement;
    target.removeEventListener("click", this.newCollectionListener);
    target.innerHTML = `<input type="text" class="collections-last__input">`;
    const input = document.querySelector(".collections-last__input") as HTMLInputElement;
    if (!input) { return; }
    input.focus();
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const collectionName = input.value;
        if (collectionName !== "") {
          // const bookmarkCreateRequest: bookmarkCreateRequest = {
          //   name: collectionName,
          //   danger: authModule.user?.Id ? authModule.user.Id.toString() : "",
          //   public: true,
          // }
          // this.eventBus.emit(events.moviePage.createCollection, bookmarkCreateRequest);
          // input.value = '';
          // input.blur();
        }
      }
    })
  }

  onCreateCollectionSuccess = (bookmarkId: string, bookmarkName: string) => {
    const currentSelect = document.querySelector(".bookmark-select") as HTMLSelectElement;
    const currentSelectLength = currentSelect?.length;
    if (!currentSelect || !currentSelectLength) {
        return;
    }
    const newOption = document.createElement("option");
    newOption.setAttribute("bookmarkid", `${bookmarkId}`);
    newOption.textContent = bookmarkName;
    currentSelect.insertBefore(newOption, currentSelect.options[currentSelectLength - 1]);
    const bookmarkItems = document.querySelector(".bookmark-items") as HTMLDivElement;
    const newCollection = document.createElement("div");
    newCollection.classList.add("hasMovie");
    newCollection.setAttribute("bookmarkid", bookmarkId);
    newCollection.textContent = bookmarkName;
    newCollection.addEventListener("click", this.collectionsDropdownListener);
    bookmarkItems.insertBefore(newCollection, bookmarkItems.lastChild);
  }

  onGotUser = () => {
    if (!this.reviewEx)
      this.renderReviewInput(this.patientId);
    this.renderCollectionsArea(this.collectionsInfo);
  }
}
