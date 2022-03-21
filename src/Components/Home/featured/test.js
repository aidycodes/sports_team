import React, { useState } from 'react';
import { easePolyOut} from 'd3-ease';
import { Animate } from 'react-move';


const Test = () => {

    const [show, setShow] = useState(true)
    const [wd, setWd] = useState('500')
    

  return (
<>
<button onClick={() => wd === '500' ? setWd('100') : setWd('500')}>update</button>
<button onClick={() => setShow(true)}>show</button> 
<button onClick={() => setShow(false) }>hide</button> 

    <Animate
    show={show}
    start={{
        backgroundColor:'green',
        width:wd,
        height:500,
        opacity:[0]
  
    }}
    enter={{
        backgroundColor:'green',
        width:[wd],
        height:[500],
        opacity:[1],
        timing:{
            duration:5000,          
            ease:easePolyOut
        }}}
    update={{backgroundColor:'green',
        opacity:[0.5],
        width:[wd],
        timing:{
            duration:2000,
            ease:easePolyOut
        },
        events:{
            start:() =>{
                    console.log('started update')
            },
            end:() =>{
                     console.log('ended update')
            },
            interrupt:() =>{
                     console.log('update interrupted')
            }
        }
    }}
    leave={[{width:[1000],
            timing:{
                duration:500,
                ease:easePolyOut
        }
    },
        {
            opacity:[0],
            timing:{
                delay:200,
                duration:1000,
                ease:easePolyOut

        }}
    ]}
 
    
    
    >
        {({ width, height, opacity, backgroundColor}) => (
            <div style={{width, height, opacity, backgroundColor}}>meepmeep</div>
        )}
    </Animate>
    
</>
  )
}

export default Test