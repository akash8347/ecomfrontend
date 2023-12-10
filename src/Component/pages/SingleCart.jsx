import React from 'react'
import './style.css'
import { cartContext } from '../../context/ContextPro'
import { useContext } from 'react'

const SingleCart = ({ item }) => {
  const { dispatch } = useContext(cartContext);


  const dispatch1 = () => {
    dispatch({
      type: "SINGLE_CART_REMOVE",
      playload: item
    })
  }

  return (
    <>

      <div style={{ width: "80%", margin: "auto" }}>
        <div className='card-container'>
          <div className='card-detail'>
            <div >{item.name}</div>
            <div>price:{item.price}</div>
          </div>
          <div className='card-quant'>
            <button className='button' onClick={() => {
              dispatch({
                type: "INCREASE_QUANTITY",
                playload: item.id


              })
            }}>+</button>
            {item.quantity}
            <button className='button minus' onClick={() => {

              (item.quantity !== 1) ? (dispatch({
                type: "DECREASE_QUANTITY",
                playload: item.id


              })) : (<>
                {document.getElementsByClassName('minus').disabled = true
                }
              </>
              )

            }} >-</button>

            <button className='x'
              onClick={
                () => {
                  dispatch1();

                }
              }
            >X</button>

          </div>
        </div>
      </div>
    </>
  )
}

export default SingleCart