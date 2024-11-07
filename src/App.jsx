import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import rectangleIcon from './icons/icons/rectangle.svg';
import triangleIcon from './icons/icons/triangle.svg';
import circleIcon from './icons/icons/circle.svg';
import brushIcon from './icons/icons/brush.svg';
import eraserIcon from './icons/icons/eraser.svg';
import textIcon from './icons/icons/type.svg';
import undoIcon from './icons/icons/rotate-ccw.svg';
import redoIcon from './icons/icons/rotate-cw.svg';
import saveIcon from './icons/icons/upload.svg';
import clearIcon from './icons/icons/trash.svg';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='container'> 

        <section className='tools'>

          <div className="component">
          <label className='shapes'>Shapes</label>
          <br></br>
          <svg width="25" height="29">
            <line x1="5" y1="20" x2="23" y2="20" stroke="black" strokeWidth="2" />
          </svg>
          <img src={circleIcon} ></img>
          <img src={rectangleIcon} ></img>
          <img src={triangleIcon} ></img>
          <svg width={25} height={15}>
            <ellipse cx="12" cy="7" rx="10" ry="6" stroke="black" strokeWidth="2" fill="white" />
          </svg>
          <svg width="25" height="20">
             <rect 
              x="5" 
              y="5" 
              width="18" 
              height="12" 
              stroke="black" 
              strokeWidth="2" 
              fill="white" 
            />
          </svg>
          
          </div>

          <div className="component">
          <input type="checkbox" id="fill-color"></input>
          <label for="fill-color"> Fill color</label>
          </div>

          <hr></hr>
          
          <div className="component">
          <img src={brushIcon} ></img>
          <label className='brush'> Brush</label>
          </div>

          <div className="component">
          <img src={eraserIcon} ></img>
          <label className='eraser'> Eraser</label>
          </div>

          <div className="component">
          <img src={textIcon} width="22" height="20"></img>
          <label className='text'>Add text</label>
          </div>

          <hr></hr>

          <div className="component">
          <input type="color" id="favcolor"></input>
          <label for="favcolor">Color</label>
          </div>

          <div className="component">
          <label for="size">Thickness</label>
          <input type="range" id="size"></input>
          </div>

          <hr></hr>

          <div className="component">
          <button id="clear"><img src={clearIcon} className='button-icon'/>clear</button>
          </div>

          <div className="component">
          <button id="undo"><img src={undoIcon} className='button-icon'/>undo</button>
          </div>

          <div className="component">
          <button id="redo"><img src={redoIcon} className='button-icon'/>redo</button>
          </div>

          <div className="component">
          <button id="save"><img src={saveIcon} className='button-icon'/>save</button>
          </div>

        </section>

        <section className='page'>
        
        </section>
    </div>
  )
}

export default App
