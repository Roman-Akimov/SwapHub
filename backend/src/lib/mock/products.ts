import times from 'lodash/times';
import random from 'lodash/random';
import sample from 'lodash/sample';

export type Product = {
  id: number;
  name: string;
  price: number;
  currency: string;
  image: string;
  description: string;
};

const MODELS = ['Iphone 10', 'Iphone 15', 'Iphone 18', 'Iphone 12', 'Iphone 14 Pro'];
const CURRENCIES = ['$', '€', 'Руб'];
const IMAGES = [
  'https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13',
];

/**
 * Генератор массива продуктов.
 *
 * times(count, fn):
 * - вызывает fn count раз
 * - складывает результаты в массив
 *
 * sample(array):
 * - выбирает случайный элемент массива
 * - может вернуть undefined (если массив пустой), поэтому есть ?? fallback
 *
 * random(min, max):
 * - генерирует случайное целое в диапазоне
 */

export const generateProducts = (count = 30): Product[] => {
  return times(count, (i) => {
    const name = sample(MODELS) ?? `Iphone ${10 + i}`;
    const currency = sample(CURRENCIES) ?? '$';
    const image = sample(IMAGES) ?? IMAGES[0];
    const price = random(50, 300);

    return {
      id: i + 1,
      name,
      currency,
      image,
      price,
      description: `${name} Buy here!`,
    };
  });
};
