type Good = {
  id: number,
  name: string,
  price: number,
  currency: string,
  image: string,
  description: string
};

export const App = () => {
  const goods: Good[] = [
    { id: 1,
      name: "Iphone",
      price: 70, 
      currency: "$", 
      image: "https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13",
      description: "Iphone 10"
    },
    { id: 1,
      name: "Iphone",
      price: 80, 
      currency: "$", 
      image: "https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13",
      description: "Iphone 11"
    },
    { id: 1,
      name: "Iphone",
      price: 90, 
      currency: "$", 
      image: "https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13",
      description: "Iphone 12"
    }
  ]

  return (
    <div>
      <h1>Swap Hub</h1>

      <div>
        {goods.map((item) => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.price}{item.currency}</p>
            <img src={item.image} alt="good" />
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )

};