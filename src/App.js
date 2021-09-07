import './App.css';
import React, { useCallback, useEffect, useState } from 'react';

const nfts = {
  kaijus: "Kaiju%20Cards",
  piggy: "Piggy%20Sol%20Gang",
  solamander: "Solamanders",
  bears: "SolBear",
  souls: "Solana%20Souls",
  boats: "BitBoat",
}

const getData = async (collection) => {
  const name = nfts[collection];
  return await (await fetch(`https://us-central1-digitaleyes-prod.cloudfunctions.net/offers-retriever?collection=${name}`)).json();
}

const defaultItems = {
  kaijus: [],
  piggy: [],
  solamanders: [],
  bears: [],
  souls: [],
  boats: [],
}

function App() {
  const [items, setItems] = useState(defaultItems);
  const [isLoading, setLoading] = useState(true);

  const updateAll = useCallback(async () => {
    setLoading(true);
    const newItems = {};

    for (const nft of Object.keys(nfts)) {
      newItems[nft] = await getData(nft);
    };

    setItems(newItems);
    setLoading(false);
  }, [setItems]);

  useEffect(()=> {
    updateAll();
  }, [updateAll, setLoading]);

  const getFloored = (collection) => {
    return items[collection].sort((item1, item2) => item1.price - item2.price)[0];
  };

  const renderItem = (item) => {
    console.log(item);
    return <a href={`https://digitaleyes.market/item/${item.mint}`} target="_blank" rel="noreferrer">{item.price/(1000000000)}</a>
  }

  return (
    <div className="App">
      <button onClick={updateAll}>
        Refresh
      </button>

      <div>
        { isLoading && 'Carregando...' }
      </div>

      {
        !isLoading && Object.keys(nfts).map((collection) => {
          return <div key={collection}>
            {collection}: {renderItem(getFloored(collection))} in {items[collection].length} sales
          </div>
        })
      }
    </div>
  );
}

export default App;
