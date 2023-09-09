import logo from "./logo.svg";
import cartLogo from "./market.png";
import plus from "./plus.png";
import minus from "./minus.png";
import "./App.css";
import { useEffect, useState } from "react";
import Modal from 'react-modal';

Modal.setAppElement('#root');
const ACCESS_TOKEN = 'VPmo2U661gTnhMVx0pc0-CtahNg_aqS5DuneLtYfO1o';

function App() {
  const [listCar, setListCar] = useState([])
  const [modalDataCart, setModalDataCart] = useState([])
  const [priceModal, setPriceModal] = useState(0)
  const [countCart, setCountCart] = useState(0)

  useEffect(() => {
    getListCar()
  }, [])

  const getListCar = () => {
    fetch('https://cdn.contentful.com/spaces/vveq832fsd73/entries?content_type=car', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      }
    }).then(async (res) => {
      let data = await res.json()
      data?.items.map((val: any) => {
        val.fields.active = false
        return val
      })

      setListCar(data?.items)
      defaultFunct()
    }).catch((err) => {
      console.log(err);
      defaultFunct()
    })
  }

  const defaultFunct = () => {
    setModalDataCart([])
    setPriceModal(0)
    setIsOpen(false)
  }

  const [modalIsOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  const handleAddCartCar = (item: any) => {
    let arr: any = modalDataCart;
    let price = priceModal
    let count = countCart

    let checkDataDup = arr.filter((val: any) => val.title == item.title)

    if (checkDataDup.length == 0) {
      arr.push(item)
      arr.map((val: any) => {
        if (val.title == item.title) {
          price += val.price
          val.value = 1
          val.active = true
          count += val.value
        }
        return val
      })
    }
    else {
      arr.map((val: any) => {
        if (val.title == item.title) {
          price += val.price
          val.value += 1
          count += val.value
          val.active = true
        }
        return val
      })
    }


    listCar.map((val: any) => {
      if (val.fields.title == item.title) {
        val.fields.active = true
      }
      return val
    })

    setListCar(listCar)
    setPriceModal(price)
    setModalDataCart(arr)
    setCountCart(arr.length)
    setIsOpen(true)
  }

  const handleChangeCart = (item: any, type: string) => {
    let arrEditCart: any = modalDataCart.map((val: any) => {
      if (val.title == item.title && val.value > 0) {
        val.value = type == 'minus' ? val.value - 1 : val.value + 1
      }
      else if (val.title == item.title && val.value == 0) {
        val.value = type == 'minus' ? val.value : val.value + 1
      }
      return val
    })

    let arrCheckValue: any = arrEditCart.filter((val: any) => {
      if (val.value > 0) {
        return val
      }
    })

    let price = 0
    let value = 0
    arrCheckValue.map((val: any) => {
      price += val.price * val.value
      value += val.value
    })

    listCar.map((val: any) => {
      if (val.fields.value == 0) {
        val.fields.active = false
      }
      return val
    })

    console.log(listCar);

    setListCar(listCar)
    setCountCart(value)
    setPriceModal(price)
    setModalDataCart(arrCheckValue)
  }

  return (
    <>
      <div id="mainApp" style={{ backgroundColor: '#e8e8e8' }}>
        {/* header */}
        <div className="app-header">
          <div>
            <img src={logo} alt="logo" />
            <span style={{ verticalAlign: "top", fontSize: 32, fontWeight: 'bold' }}>Drivehub</span>
          </div>
          <div onClick={() => setIsOpen(true)}>
            <img src={cartLogo} alt="logo" style={{ height: 25 }} />
            <span style={{ verticalAlign: "top", fontSize: 19, fontWeight: 'bold' }}>{`Cart (${countCart})`}</span>
          </div>
        </div>
        {/* body */}
        <div className="center">
          <div
            className="divRowListCar"
          >
            {listCar.map((item: any, index: number) => {
              return (
                <div className="divRow" key={index}>
                  <img style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }} src={item.fields.photo} width={'100%'} height={240} />
                  <div style={{ padding: 5 }}>
                    <label>
                      {item.fields.title}
                    </label>
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: 10 }}>
                    <button className={item.fields.active ? "btnAddCartActive" : "btnAddCart"} onClick={() => handleAddCartCar(item.fields)} disabled={item.fields.active ? true : false}> {item.fields.active ? 'Added' : 'Add to cart'}</button>
                  </div>
                </div>
              )
            }
            )}

          </div>
        </div>
        {/* footer */}
        <div className="app-footer">FOOTER</div>
      </div>

      {/* modal cart */}
      <div>
        <Modal
          id="modalCart"
          isOpen={countCart == 0 ? false : modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>Carts</h2>
          <div className="divCartItems">
            {
              modalDataCart ? modalDataCart.map((item: any, index: number) => {
                return (
                  <div className="divCartItems" key={index}>
                    <div key={index}>
                      <img id="imageRes" src={item.photo} alt="logo" style={{ height: 100, width: 150 }} />
                      <span id="textWarpRes1">{item.title}</span>
                      <span id="textWarpRes2" style={{ fontWeight: 'normal' }}> &nbsp;{(item.price).toLocaleString() + " THB/Per Days"}</span>
                    </div>

                    <div id="mnDiv">
                      <img className="altP" src={plus} alt="logo" style={{ height: 25, marginLeft: 5 }} onClick={() => handleChangeCart(item, 'plus')} />
                      <span style={{ marginLeft: 5 }}>{item.value}</span>
                      <img className="altM" src={minus} alt="logo" style={{ height: 25, marginLeft: 5 }} onClick={() => handleChangeCart(item, 'minus')} />
                    </div>
                  </div>
                )
              }) : null
            }

          </div>

          <input className="inputModalDiscount" type="text" placeholder="Discount Code" />

          <div className="divTest">
            <div>Total</div>
            <div>{priceModal.toLocaleString()}</div>
          </div>
          <div className="divTest">
            <div>Discount</div>
            <div>0</div>
          </div>
          <div className="divTest">
            <div>Grand Total</div>
            <div>{priceModal.toLocaleString()}</div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default App;


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '40%'
  },
};