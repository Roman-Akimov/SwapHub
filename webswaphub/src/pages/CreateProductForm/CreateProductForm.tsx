import React, { useRef, useState } from 'react';
import css from './CreateProductForm.module.scss';
import type { FormError, FormState } from './FormState';

const initialState: FormState = {
  name: '',
  imageFile: null,
  description: '',
  price: '',
  currency: 'RUB',
}

export const CreateProductForm = () => {
  const [state, setState] = useState<FormState>(initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    // Сброс в начальное состояние
    setState(initialState);
    setErrors({})
    setPreviewUrl(null)
    if (fileInputRef.current){
      fileInputRef.current.value = ''
    }

  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.currentTarget;
    setState((prev) => {
      return { ...prev, [name]: value };
    });
    setErrors((prev) => {
      if (!prev[name as keyof FormState]) {
        return prev;
      }
      return { ...prev, [name]: undefined };
    });
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0] ?? null;
    setState((prev) => {
      return { ...prev, imageFile: file };
    });
    setErrors((prev) => {
      if (!prev.imageFile) {
        return prev;
      }
      return { ...prev, imageFile: undefined };
    });
  };

  const validate = (values: FormState): FormError => {
    const nextErrors: FormError = {};
    // name
    const name = values.name.trim();
    if (name.length === 0) {
      nextErrors.name = 'Введите название товара';
    } else if (name.length < 2) {
      nextErrors.name = 'В названии товара должно быть минимум 2 символа!';
    }

    if (!values.imageFile) {
      nextErrors.imageFile = 'Добавьте изображение!';
    } else {
      if (!values.imageFile.type.startsWith('image/')) {
        nextErrors.imageFile = 'Можно загрузить только изображение';
      } else if (values.imageFile.size > 5 * 1024 * 1024) {
        nextErrors.imageFile = 'Максимальный размер файла — 5 MB';
      }
    }

    // descripton
    const description = values.description.trim();
    if (description.length === 0) {
      nextErrors.description = 'Опишите свой товар';
    } else if (description.length < 15) {
      nextErrors.description = 'В описании должно быть минимум 15 символов';
    }
    // price
    const rawPrice = values.price.trim();
    if (rawPrice.length === 0) {
      nextErrors.price = 'Укажите цену';
    } else {
      const normalized = rawPrice.replace(',', '.');
      const priceToNumber = Number(normalized);

      if (!Number.isFinite(priceToNumber)) {
        nextErrors.price = 'Цена должна быть числом';
      } else if (priceToNumber <= 0) {
        nextErrors.price = 'Цена должна быть больше нуля';
      }
    }

    // currency
    if (!values.currency) {
      nextErrors.currency = 'Укажите тип валюты';
    }
    return nextErrors;
  };

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate(state);
    setErrors(nextErrors);

    const hasErrors = Object.keys(nextErrors).length > 0;

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => {
        return setTimeout(resolve, 3000)
      });
      // eslint-disable-next-line no-console
      console.info('Submit OK:', state);
      resetForm()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!state.imageFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(state.imageFile);
    setPreviewUrl(url);

    return () => {
      return URL.revokeObjectURL(url);
    };
  }, [state.imageFile]);

  return (
    <div>
      <div>
        <h1 className={css.title}>Выставить товар</h1>
      </div>
      <div>
        <form onSubmit={onSubmit}>
          {/** Форма названия товара */}
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="name">Введите название товара:</label>
            <br />
            <input type="text" onChange={handleChange} value={state.name} name="name" id="name" />
            {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
          </div>

          {/* Изображение: превью + кнопка выбора */}
          <div className={css.imageRow}>
            <div className={css.imagePreview}>
              {previewUrl ? (
                <img className={css.image} src={previewUrl} alt="preview" />
              ) : (
                <div className={css.imagePlaceholder}>Превью изображения</div>
              )}
            </div>

            <div className={css.imageControls}>
              <label className={css.fileLabel}>
                Добавьте изображение
                <input className={css.fileInput} ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} />
              </label>

              <button
                type="button"
                className={css.secondaryButton}
                onClick={() => {
                  setState((prev) => {
                    return { ...prev, imageFile: null };
                  });
                  setErrors((prev) => {
                    return { ...prev, imageFile: undefined };
                  });
                }}
              >
                Очистить
              </button>

              {errors.imageFile && <div style={{ color: 'red' }}>{errors.imageFile}</div>}
            </div>
          </div>

          {/** Описание товара */}
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="description">Опишите свой товар:</label>
            <br />
            <textarea
              onChange={handleChange}
              value={state.description}
              name="description"
              id="description"
              placeholder="Описание"
            />
            {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
          </div>
          {/** Цена товара */}
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="price">Укажите цену:</label>
            <br />
            <input onChange={handleChange} value={state.price} type="text" name="price" id="price" />
            {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
          </div>
          {/** Валюта */}
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="currency">Укажите валюту:</label>
            <br />
            <select value={state.currency} onChange={handleChange} name="currency" id="currency">
              <option value="RUB">RUB</option>
              <option value="USD">USD</option>
            </select>
            {errors.currency && <div style={{ color: 'red' }}>{errors.currency}</div>}
          </div>

          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Отправка...' : 'Выставить товар'}</button>
        </form>
      </div>
    </div>
  );
};
