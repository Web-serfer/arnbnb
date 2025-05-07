'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Container from '../../Container';
import { categoriesData } from './categoriesData';
import Filters from './Filters';
import CategoryItem from './CategoryItem';
import { useSearchParams, useRouter } from 'next/navigation'; // useRouter может использоваться в будущем для навигации
import useFiltersModal from '@/app/hooks/useFiltersModal';
import FilterModal from '../../modals/FilterModal';

const Categories = () => {
  // const router = useRouter(); // Не используется, но может пригодиться для логики выбора категории
  const params = useSearchParams(); // Не используется напрямую
  const [isHovered, setIsHovered] = useState(false); // Состояние наведения курсора на слайдер
  const [isDragging, setIsDragging] = useState(false); // Состояние перетаскивания слайдера
  const sliderRef = useRef<HTMLDivElement>(null); // Ссылка на DOM-элемент слайдера
  const scrollTimeout = useRef<NodeJS.Timeout>(); // Ссылка на таймер автопрокрутки

  // Хук для управления модальным окном фильтров
  const filtersModal = useFiltersModal();

  // Обработчик открытия модального окна фильтров
  const handleFiltersClick = useCallback(() => {
    filtersModal.onOpen();
  }, [filtersModal]);

  // Обработчик закрытия модального окна фильтров
  const handleFiltersClose = useCallback(() => {
    filtersModal.onClose();
  }, [filtersModal]);

  // Обработчик применения фильтров
  const handleFiltersSubmit = useCallback(() => {
    filtersModal.onClose();
  }, [filtersModal]);

  // Функция для вычисления шага прокрутки слайдера
  const calculateScrollStep = useCallback(() => {
    if (!sliderRef.current) return 0;
    const container = sliderRef.current;
    const firstItem = container.children[0] as HTMLElement; // Получаем первый элемент
    // Возвращаем ширину первого элемента + отступы (gap) между элементами
    return (
      firstItem?.offsetWidth + parseInt(getComputedStyle(container).gap) || 0
    );
  }, []);

  // Функция для перехода к следующему слайду
  const goToNext = useCallback(() => {
    if (isDragging || !sliderRef.current) return; // Прерываем, если слайдер перетаскивается или отсутствует

    const container = sliderRef.current;
    const scrollStep = calculateScrollStep(); // Вычисляем шаг прокрутки
    const maxScroll = container.scrollWidth - container.clientWidth; // Максимальное значение прокрутки

    container.scrollBy({
      left:
        container.scrollLeft + scrollStep >= maxScroll
          ? -container.scrollLeft // Если достигли конца, переходим в начало
          : scrollStep, // Иначе прокручиваем на один шаг
      behavior: 'smooth', // Плавная прокрутка
    });
  }, [isDragging, calculateScrollStep]);

  // Функция для перехода к предыдущему слайду
  const goToPrevious = useCallback(() => {
    if (isDragging || !sliderRef.current) return;

    const container = sliderRef.current;
    const scrollStep = calculateScrollStep();

    container.scrollBy({
      left:
        container.scrollLeft - scrollStep <= 0
          ? container.scrollWidth // Если достигли начала, переходим в конец
          : -scrollStep, // Иначе прокручиваем назад на один шаг
      behavior: 'smooth',
    });
  }, [isDragging, calculateScrollStep]);

  // Эффект для автоматической прокрутки слайдера
  useEffect(() => {
    // Запускаем автопрокрутку, если курсор не наведен на слайдер и слайдер не перетаскивается
    if (!isHovered && !isDragging) {
      scrollTimeout.current = setInterval(goToNext, 3000); // Прокручиваем каждые 3 секунды
    }
    // Очищаем таймер при размонтировании компонента или изменении зависимостей
    return () => clearInterval(scrollTimeout.current);
  }, [isHovered, isDragging, goToNext]);

  // Обработчики событий для перетаскивания слайдера
  const handleMouseDown = () => setIsDragging(true); // Начало перетаскивания
  const handleMouseUp = () => setIsDragging(false); // Конец перетаскивания
  const handleMouseLeave = () => setIsDragging(false); // Курсор ушел со слайдера

  return (
    <Container>
      <div className="flex w-full flex-col items-center justify-between sm:flex-row">
        {/* Контейнер слайдера */}
        <div
          className="relative flex w-full items-center overflow-hidden px-7 py-4 sm:w-[90%]"
          onMouseEnter={() => setIsHovered(true)} // Устанавливаем флаг наведения при входе курсора
          onMouseLeave={() => setIsHovered(false)} // Сбрасываем флаг наведения при выходе курсора
        >
          {/* Кнопка "Назад" */}
          <button
            className="absolute left-2.5 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white opacity-90 shadow-md transition-opacity duration-200 hover:opacity-100 sm:flex"
            onClick={goToPrevious}
            aria-label="Предыдущая категория"
          >
            <IoIosArrowBack className="text-lg text-gray-500 transition-colors duration-200 hover:text-gray-700" />
          </button>

          {/* Слайдер */}
          <div
            className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth px-5"
            ref={sliderRef} // Привязываем ссылку к элементу
            role="tablist" // Указываем роль для доступности
            onMouseDown={handleMouseDown} // Обработчик начала перетаскивания
            onMouseUp={handleMouseUp} // Обработчик конца перетаскивания
            onMouseLeave={handleMouseLeave} //  Обработчик ухода курсора
          >
            {/* Отображаем элементы категорий */}
            {categoriesData.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>

          {/* Кнопка "Вперед" */}
          <button
            className="absolute right-2.5 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white opacity-90 shadow-md transition-opacity duration-200 hover:opacity-100 sm:flex"
            onClick={goToNext}
            aria-label="Следующая категория"
          >
            <IoIosArrowForward className="text-lg text-gray-500 transition-colors duration-200 hover:text-gray-700" />
          </button>
        </div>

        {/* Кнопка "Фильтры" */}
        <Filters
          onFiltersToggle={handleFiltersClick} // Передаем обработчик открытия/закрытия
          isActive={filtersModal.isOpen} // Передаем состояние открытия модального окна
        />
      </div>

      {/* Модальное окно фильтров */}
      <FilterModal
        isOpen={filtersModal.isOpen} // Передаем состояние открытия
        onClose={handleFiltersClose} // Передаем обработчик закрытия
        onSubmit={handleFiltersSubmit} // Передаем обработчик применения фильтров
      />
    </Container>
  );
};

export default Categories;
