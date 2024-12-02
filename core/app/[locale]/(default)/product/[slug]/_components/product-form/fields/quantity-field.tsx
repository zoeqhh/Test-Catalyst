import { useTranslations } from 'next-intl';

import { Counter, Label } from '~/components/ui/form';

import { useProductFieldController } from '../use-product-form';

export const QuantityField = () => {
  const { field } = useProductFieldController({
    name: 'quantity',
    rules: { required: true, min: 1 },
    defaultValue: 1,
  });
  const t = useTranslations('Product.Form');

  return (
    <div className="basis-full xs:basis-1/2 lg:basis-full xl:basis-1/2">
      <Label className="mb-5 inline-block hidden lg:inline-block" htmlFor="quantity">
        {t('quantityLabel')}:
      </Label>
      <Counter
        id="quantity"
        min={1}
        name={field.name}
        onChange={field.onChange}
        value={Number(field.value)}
      />
    </div>
  );
};
