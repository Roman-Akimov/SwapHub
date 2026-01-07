import type { Good } from "../../types/Good.type";

export const GoodCard = (props: Good) => {
  const { good } = props;

  return (
    <div className="goods-view">
      <h2>{good.name}</h2>
      <p>
        {good.price}
        {good.currency}
      </p>
      <img src={good.image} alt={good.name} width={80} />
      <p>{good.description}</p>
    </div>
  );
};
