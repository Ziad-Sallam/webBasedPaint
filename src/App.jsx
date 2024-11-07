import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


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

  const [circleBtn, setCircleBtn] = useState(false);
  const [squareBtn, setSquareBtn] = useState(false);
  const [triangleBtn, setTriangleBtn] = useState(false);
  const [ellipseBtn, setEllipseBtn] = useState(false);
  const [arrowBtn, setArrowBtn] = useState(false);
  const [brushBtn, setBrushBtn] = useState(true);
  const [eraseBtn, setEraseBtn] = useState(false);
  const [textBtn, setTextBtn] = useState(false);


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

  function handleClick(e){

    const btnId = e.target.id;
    const x = e.target.className;
    setArrowBtn(false);
    setBrushBtn(false);
    setCircleBtn(false);
    setEllipseBtn(false);
    setTextBtn(false);
    setEraseBtn(false);
    setTriangleBtn(false);
    setSquareBtn(false);

    switch(btnId || x) {
      case "arrow":
        setArrowBtn(true);
        setDrawAction(DrawAction.Arrow);

        break;
      case "circle":
        setCircleBtn(true);
        setDrawAction(DrawAction.Circle);
        break;
      case "square":
        setSquareBtn(true);
        setDrawAction(DrawAction.Rectangle);
        break;
      case "ellipse":
        setEllipseBtn(true);
        setDrawAction(DrawAction.Ellipse);
        break;
      case "brush":
        setBrushBtn(true);
        setDrawAction(DrawAction.Scribble);
        break;
      case "eraser":
        setEraseBtn(true);
        break;

        case "triangle":
          setTriangleBtn(true);
          setDrawAction(DrawAction.Triangle);
          break;
      case "text":
        setTextBtn(true);
        break;

    }
  }


  const onStageMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  return (
    <div className="container">
      <section className="tools">
        <div className="component">
          <div className={"shapes"}>
            <label className="shapes">Shapes</label>
            <br/>
            <button id={"arrow"} className={"arrow btn " + (arrowBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
              <i className="arrow bi bi-arrow-up-right"></i>
            </button>

            <button id={"circle"} className={"circle btn " + (circleBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
              <i className={"circle bi bi-circle"}/>
            </button>

            <button id={"square"} className={"square btn " + (squareBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}><i
                className="square bi bi-square"></i></button>

            <button id={"triangle"} className={"triangle btn " + (triangleBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}><i className="triangle bi bi-triangle"></i></button>

            <button id={"ellipse"} className={"ellipse btn " + (ellipseBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
              <svg width={25} height={15} className={"ellipse"}>
                <ellipse className={"ellipse"} cx="8" cy="5" rx="8" ry="4" stroke="black" strokeWidth="1" fill="none"/>
              </svg>
            </button>
          </div>

        </div>
        <hr></hr>

        <div className="component">
          <button id={"brush"} className={"brush btn " + (brushBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
            <label className='brush'><i className="brush bi bi-brush"></i> Brush</label>
          </button>
        </div>

        <div className="component">
          <button id={"eraser"} className={"eraser btn " + (eraseBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
            <label className='eraser'><i className="eraser bi bi-eraser"></i> Eraser</label>
          </button>
        </div>


      <div className="component">
          <button id={"text"} className={"text btn " + (textBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
            <label className='text'><i className="text bi bi-fonts"></i> Add text</label>
          </button>
      </div>

        <hr></hr>

          <div className="component">
          <input className={"form-control form-control-color"} type="color" id="favcolor" onChange={(e) => setColor(e.target.value)} ></input>
          <label for="favcolor">  Color</label>
          </div>

          <div className="component">
          <label for="size">Thickness</label>
          <input className={"form-range"} type="range" id="size"
          min="1"
          max="10"
          value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))}></input>
          </div>

          <hr></hr>

          <div className="component">
          <button className={"btn btn-outline-dark"} id="clear" onClick={handleClear}>
            <i className="bi bi-trash"></i> clear
          </button>
          </div>

        <div className="component">
          <button id="undo" className={"btn btn-outline-dark"}><i className="bi bi-arrow-counterclockwise"></i> undo</button>
        </div>

        <div className="component">
          <button id="redo" className={"btn btn-outline-dark"}><i className="bi bi-arrow-clockwise"></i> redo</button>
        </div>

        <div className="component">
          <button id="save" className={"btn btn-outline-dark"}><i className="bi bi-floppy"></i> save</button>
        </div>

      </section>

      <div className="screen">
        <Stage
          width={1000}
          height={700}
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