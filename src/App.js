import { useEffect, useState } from "react";
import "./App.css";
import classes from "./styles.module.css";

function App() {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [amount, setAmount] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item?.title?.toLowerCase().includes(search.toLowerCase())
    );
    setNewData(filteredData);
  }, [search, amount]);

  const inc = (item) => {
    const selectedIndex = selected.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (selectedIndex === -1) {
      setSelected([...selected, { ...item, quantity: 1 }]);
      // console.log(selected);
    } else {
      const updatedSelected = [...selected];
      updatedSelected[selectedIndex].quantity += 1;
      setSelected(updatedSelected);
    }
  };

  const dec = (item) => {
    const selectedIndex = selected.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (selectedIndex !== -1) {
      const updatedSelected = [...selected];
      const currentQuantity = updatedSelected[selectedIndex].quantity;
      if (currentQuantity > 0) {
        updatedSelected[selectedIndex].quantity -= 1;

        if (updatedSelected[selectedIndex].quantity === 0) {
          updatedSelected.splice(selectedIndex, 1);
        }

        setSelected(updatedSelected);
      }
    }
  };

  const calculateTotalAmount = () => {
    return selected.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const changeHandle = (e) => {
    setSearch(e.target.value);
  };

  const displayData = search !== "" ? newData : data;

  return (
    <div className={classes.app}>
      <div className={classes.nav} style={{ display: "flex" }}>
        <input
        className={classes.input}
          type="text"
          value={search}
          onChange={changeHandle}
          placeholder="Search..."
        />
        <h3 className={classes.total}>Total Amount : {calculateTotalAmount()}</h3>
      </div>
      <div className={classes.container}>
        <div className={classes.main}>
          {displayData.map((item, key) => (
            <div key={key} className={classes.item}>
              <img src={item.image} className={classes.image} />
              <p className={classes.title}>
                {item.title.length < 20
                  ? item.title
                  : item.title.slice(0, 17) + "..."}
              </p>
              <p className={classes.price}>Price : {item.price}</p>
              <div className={classes.button}>
                <button onClick={() => dec(item)}>-</button>
                <p className={classes.qty}>
                  Qty : {selected.find((q) => q.id === item.id)?.quantity || 0}
                </p>
                <button onClick={() => inc(item)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className={classes.select}>
          <h3>Selected Items</h3>
          {selected.map((item) => (
            <div
              key={item.id}
              className={classes.selected}
            >
              <img src={item.image} className={classes.seImg}/>
              <p>{item.title.length < 20
                  ? item.title
                  : item.title.slice(0, 10) + "..."}</p>
              <p>Qty : {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
