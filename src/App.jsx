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
import { KonvaEventObject } from "konva/lib/Node";

import { useState, useRef, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect as KonvaRect,
  Circle as KonvaCircle,
  Line as KonvaLine,
  Arrow as KonvaArrow,
  RegularPolygon as KonvaTriangle,
  Ellipse as KonvaEllipse,
  Ellipse,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";

const DrawAction = {
  Scribble: 'Scribble',
  Circle: 'Circle',
  Rectangle: 'Rectangle',
  Arrow: 'Arrow',
  Eraser: 'Eraser',
  Select: 'Select',
  Triangle: 'Triangle',    // Added Triangle action
  Ellipse: 'Ellipse',      // Added Ellipse action
};

function App() {
  const [drawAction, setDrawAction] = useState(DrawAction.Scribble);
  const [color, setColor] = useState('black');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [scribbles, setScribbles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [triangles, setTriangles] = useState([]); 
  const [ellipses, setEllipses] = useState([]);   

  const stageRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentShapeRef = useRef(null);


  const handleClear = () => {
    setScribbles([]);
    setCircles([]);
    setRectangles([]);
    setArrows([]);
    setEllipses([]);
    setTriangles([]);
   
  };

  const onStageMouseDown = useCallback((e) => {
    isDrawingRef.current = true;
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    const x = pos.x;
    const y = pos.y;
    const id = uuidv4();

    currentShapeRef.current = id;

    switch (drawAction) {
      case DrawAction.Scribble:
        setScribbles((prev) => [...prev, { id, points: [x, y], color ,strokeWidth}]);
        break;
      case DrawAction.Circle:
        setCircles((prev) => [...prev, { id, radius: 1, x, y, color,strokeWidth }]);
        break;
      case DrawAction.Rectangle:
        setRectangles((prev) => [...prev, { id, width: 1, height: 1, x, y, color ,strokeWidth}]);
        break;
      case DrawAction.Arrow:
        setArrows((prev) => [...prev, { id, points: [x, y, x, y], color,strokeWidth }]);
        break;
      case DrawAction.Triangle:
        setTriangles((prev) => [...prev, { id, x, y, width: 1, height: 1, color,strokeWidth }]);
        break;
      case DrawAction.Ellipse:
        setEllipses((prev) => [...prev, { id, x, y, radiusX: 1, radiusY: 1, color,strokeWidth }]);
        break;
    }
  }, [drawAction, color,strokeWidth]);




  const onStageMouseMove = useCallback(() => {
    if (!isDrawingRef.current) return;
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    const x = pos.x;
    const y = pos.y;

    switch (drawAction) {
      case DrawAction.Scribble:
        setScribbles((prev) =>
          prev.map((scribble) =>
            scribble.id === currentShapeRef.current ? { ...scribble, points: [...scribble.points, x, y] } : scribble
          )
        );
        break;
      case DrawAction.Circle:
        setCircles((prev) =>
          prev.map((circle) =>
            circle.id === currentShapeRef.current
              ? { ...circle, radius: Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2) }
              : circle
          )
        );
        break;
      case DrawAction.Rectangle:
        setRectangles((prev) =>
          prev.map((rectangle) =>
            rectangle.id === currentShapeRef.current ? { ...rectangle, width: x - rectangle.x, height: y - rectangle.y } : rectangle
          )
        );
        break;
      case DrawAction.Arrow:
        setArrows((prev) =>
          prev.map((arrow) =>
            arrow.id === currentShapeRef.current ? { ...arrow, points: [arrow.points[0], arrow.points[1], x, y] } : arrow
          )
        );
        break;
      case DrawAction.Triangle:
        setTriangles((prev) =>
          prev.map((triangle) =>
            triangle.id === currentShapeRef.current ? { ...triangle, width: x - triangle.x, height: y - triangle.y } : triangle
          )
        );
        break;
      case DrawAction.Ellipse:
        setEllipses((prev) =>
          prev.map((ellipse) =>
            ellipse.id === currentShapeRef.current ? { ...ellipse, radiusX: Math.abs(x - ellipse.x), radiusY: Math.abs(y - ellipse.y) } : ellipse
          )
        );
        break;
    }
  }, [drawAction]);







  

  const onStageMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  return (
    <div className="container">
      <section className="tools">
        <div className="component">
          <label className="shapes">Shapes</label>
          <br />
          <svg width="25" height="29" onClick={() => setDrawAction(DrawAction.Arrow)}>
            <line x1="5" y1="20" x2="23" y2="20" stroke="black" strokeWidth="2" />
          </svg>
          <img src={circleIcon} onClick={() => setDrawAction(DrawAction.Circle)} />
          <img src={rectangleIcon} onClick={() => setDrawAction(DrawAction.Rectangle)} />
          <img src={triangleIcon} onClick={() => setDrawAction(DrawAction.Triangle)} />
          <svg width={25} height={15} onClick={() => setDrawAction(DrawAction.Ellipse)}>
            <ellipse cx="12" cy="7" rx="10" ry="6" stroke="black" strokeWidth="2" fill="white" />
          </svg>
        </div>
          <hr></hr>


        <div className="component">
          <img src={brushIcon} onClick={() => setDrawAction(DrawAction.Scribble)}></img>
          <label className='brush'> Brush</label>
          </div>

          <div className="component">
          <img src={eraserIcon} ></img>
          <label className='eraser'> Eraser</label>
          </div>

          <div className="component">
          <img src={textIcon} ></img>
          <label className='text'> Add text</label>
          </div>

          <hr></hr>

          <div className="component">
          <input type="color" id="favcolor" onChange={(e) => setColor(e.target.value)} ></input>
          <label for="favcolor">  Color</label>
          </div>

          <div className="component">
          <label for="size">Thickness</label>
          <input type="range" id="size" 
          min="1"
          max="10"
          value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))}></input>
          </div>

          <hr></hr>

          <div className="component">
          <button id="clear"  onClick={handleClear}><img src={clearIcon} className='button-icon' />clear</button>
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
      

      <div className="screen">
        <Stage
          width={1000}
          height={500}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          onMouseUp={onStageMouseUp}
          ref={stageRef}
        >
          <Layer>
            {scribbles.map((scribble) => (
              <KonvaLine key={scribble.id} points={scribble.points} stroke={scribble.color} strokeWidth={scribble.strokeWidth} />
            ))}
            {circles.map((circle) => (
              <KonvaCircle key={circle.id} x={circle.x} y={circle.y} radius={circle.radius} stroke={circle.color} strokeWidth={circle.strokeWidth}  />
            ))}
            {rectangles.map((rectangle) => (
              <KonvaRect key={rectangle.id} x={rectangle.x} y={rectangle.y} width={rectangle.width} height={rectangle.height}  stroke={rectangle.color} strokeWidth={rectangle.strokeWidth}  />
            ))}
            {arrows.map((arrow) => (
              <KonvaArrow key={arrow.id} points={arrow.points} stroke={arrow.color} strokeWidth={arrow.strokeWidth}  />
            ))}
            {triangles.map((triangle) => (
              <KonvaTriangle key={triangle.id} x={triangle.x} y={triangle.y} sides={3} radius={Math.sqrt(triangle.width ** 2 + triangle.height ** 2)} stroke={triangle.color} strokeWidth={triangle.strokeWidth}  />
            ))}
            {ellipses.map((ellipse) => (
              <KonvaEllipse key={ellipse.id} x={ellipse.x} y={ellipse.y} radiusX={ellipse.radiusX} radiusY={ellipse.radiusY}  stroke={ellipse.color} strokeWidth={ellipse.strokeWidth}  />
            ))}
          
           
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default App;