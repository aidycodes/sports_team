import React from 'react';
import { easePolyOut} from 'd3-ease';
import { Animate } from 'react-move';

let stripesState = [
    {
        background:'#98c5e9',
        left:120,
        rotate:25,
        top:-260, 
        delay:0
    },
    {
        background:'#ffffff',
        left:360,
        rotate:25,
        top:-394, 
        delay:200
    },
    {
        background:'#98c5e9',
        left:600,
        rotate:25,
        top:-498, 
        delay:400
    },

];

const handleShowStrip = () => {
    return (
    stripesState.map((stripe,i) =>{
       return (
        <Animate
        key={i}
        show={true}
        start={{background:"#ffffff",
        opacity:0,
        left:0,
        rotate:0,
        top:0
        }}
       enter={{background:`${stripe.background}`,
        opacity:[1],
        left:[stripe.left],
        rotate:[stripe.rotate],
        top:[stripe.top],
        timing:{
            delay:stripe.delay,
            duration:200,
            ease:easePolyOut

        }
    }}
          >
            {({ background, opacity, left, rotate, top }) =>(
                <div className="stripe"
                style={{
                background,
                opacity,
                transform:`rotate(${rotate}deg) translate(${left}px,${top}px)` 
                }}
                    >

                </div>
            )}
        </Animate>
    )})
    )}

const Stripes = () => {
  return (
    <div className="featured_stripes">
        {handleShowStrip()}
    </div>
  )
}

export default Stripes