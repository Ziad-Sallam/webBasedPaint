import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Transformer } from 'react-konva';
import './App.css'
import { KonvaEventObject } from "konva/lib/Node";
import { useState, useRef, useCallback } from "react";
import { useEffect } from "react";
import {
  Stage,
  Layer,
  Rect as KonvaRect,
  Circle as KonvaCircle,
  Line as KonvaLine,
  Arrow as KonvaArrow,
  RegularPolygon as KonvaTriangle,
  Ellipse as KonvaEllipse,
  Text as KonvaText,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";

const DrawAction = {
  Scribble: 'Scribble',
  Circle: 'Circle',
  Rectangle: 'Rectangle',
  Arrow: 'Arrow',
  Eraser: 'Eraser',
  Select: 'Select',
  Triangle: 'Triangle',    
  Ellipse: 'Ellipse',
  Text: 'Text',    
};

function App() {
  const [drawAction, setDrawAction] = useState(DrawAction.Scribble);
  const [color, setColor] = useState('black');
  const [previousColor, setPreviousColor] = useState('black');
  const [eraserMode, setEraserMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [scribbles, setScribbles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [triangles, setTriangles] = useState([]); 
  const [ellipses, setEllipses] = useState([]);
  const [texts, setTexts] = useState([]);
  const [inputText, setinputText] = useState("");

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
  const transformerRef = useRef(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  
  const onShapeClick = useCallback(
    (e) => {
      if (drawAction !== DrawAction.Select) return;
      const currentTarget = e.target;
      const shapeType = currentTarget.attrs.type; 
      setSelectedShape({
        shape: currentTarget,
        type: shapeType,
        id: currentTarget.attrs.id, 
      });
      transformerRef.current.nodes([currentTarget]);
      transformerRef.current.getLayer().batchDraw();
    },
    [drawAction]
  );

  const onCopyShape = () => {
    if (!selectedShape) return;
    const { type, shape } = selectedShape;
    const { x, y, width, height, radius, stroke, strokeWidth, points, sides} = shape.attrs;
    let shapeCopy = { ...shape.attrs };  
    if (type === 'arrow') {
      shapeCopy.points = points.map((point, index) =>
        index % 2 === 0 ? point + 20 : point + 20 
      );
    } else {
      shapeCopy.x = (x || 0) + 20;
      shapeCopy.y = (y || 0) + 20;
    }
  
    shapeCopy.color = shapeCopy.stroke;
    const newShape = { ...shapeCopy, id: uuidv4() };
    switch (type) {
      case 'rectangle':
        setRectangles((prev) => [...prev, newShape]);
        break;
      case 'circle':
        setCircles((prev) => [...prev, newShape]);
        break;
      case 'ellipse':
        setEllipses((prev) => [...prev, newShape]);
        break;
      case 'triangle':
        setTriangles((prev) => [...prev, newShape]);
        break;
      case 'arrow':
        setArrows((prev) => [...prev, newShape]);
        break;
      case 'text':
        setTexts((prev) => [...prev, newShape]);
        break;
      default:
        break;
    }

  };
  
  const onDeleteShape = () => {
    if (!selectedShape) return; 
    const {type, id } = selectedShape;
    if (type === "rectangle") {
      setRectangles((prevRectangles) =>
        prevRectangles.filter((rect) => rect.id!== id)
        
      );

      console.log("delete",id)
    } else if (type === "circle") {
      setCircles((prevCircles) =>
        prevCircles.filter((circle) => circle.id !== id)
      );
    }else if(type=="arrow"){
      setArrows((prevarrows)=>prevarrows.filter((arr=>arr.id!=id))
      )
    }else if(type=="ellipse"){
      setEllipses((preveli)=>preveli.filter((eli=>eli.id!=id))
    )
  }else if(type=="triangle"){
    setTriangles((prevtri)=>prevtri.filter((tri=>tri.id!=id))
  )
  }
  
    setSelectedShape(null);
    transformerRef.current.nodes([]);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete") {
        onDeleteShape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShape]);

  const handleClear = () => {
    setScribbles([]);
    setCircles([]);
    setRectangles([]);
    setArrows([]);
    setEllipses([]);
    setTriangles([]);
    setTexts([]);
  };
  const saveStateToUndoStack = () => {
    setUndoStack((prev) => [
      ...prev,
      {
        scribbles,
        circles,
        rectangles,
        arrows,
        triangles,
        ellipses,
        texts,
      },
    ]);
  };
  const handleUndo = () => {
    if (undoStack.length === 0) return;
  
    const lastState = undoStack.pop();
    setRedoStack((prev) => [
      ...prev,
      {
        scribbles,
        circles,
        rectangles,
        arrows,
        triangles,
        ellipses,
        texts,
      },
    ]);
    setScribbles(lastState.scribbles);
    setCircles(lastState.circles);
    setRectangles(lastState.rectangles);
    setArrows(lastState.arrows);
    setTriangles(lastState.triangles);
    setEllipses(lastState.ellipses);
    setTexts(lastState.texts);
    setUndoStack([...undoStack]);
  };
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack.pop();
    setUndoStack((prev) => [
      ...prev,
      {
        scribbles,
        circles,
        rectangles,
        arrows,
        triangles,
        ellipses,
        texts,
      },
    ]);
    setScribbles(nextState.scribbles);
    setCircles(nextState.circles);
    setRectangles(nextState.rectangles);
    setArrows(nextState.arrows);
    setTriangles(nextState.triangles);
    setEllipses(nextState.ellipses);
    setTexts(nextState.texts);
  
    setRedoStack([...redoStack]);
  };
  

  const onStageMouseDown = useCallback((e) => {
    saveStateToUndoStack();
    setRedoStack([]);
    const stage = stageRef.current;
    const clickedOnStage = e.target === stage;
    if (clickedOnStage && drawAction === DrawAction.Select) {
      setSelectedShape(null);
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }
    if (drawAction !== DrawAction.Select) {
      isDrawingRef.current = true;
      const pos = stage.getPointerPosition();
      const x = pos.x;
      const y = pos.y;
      const id = uuidv4();
  
      currentShapeRef.current = id;
    switch (drawAction) {
      
      case DrawAction.Scribble:
        setScribbles((prev) => [...prev, { id, points: [x, y], color, strokeWidth }]);
        break;
      case DrawAction.Circle:
        setCircles((prev) => [...prev, { id, radius: 1, x, y, color, strokeWidth }]);
        break;
      case DrawAction.Rectangle:
        setRectangles((prev) => [...prev, { id, width: 1, height: 1, x, y, color, strokeWidth }]);
        break;
      case DrawAction.Arrow:
        setArrows((prev) => [...prev, { id, points: [x, y, x, y], color, strokeWidth }]);
        break;
      case DrawAction.Triangle:
        setTriangles((prev) => [...prev, { id, x, y, width: 1, height: 1, color, strokeWidth }]);
        break;
      case DrawAction.Ellipse:
        setEllipses((prev) => [...prev, { id, x, y, radiusX: 1, radiusY: 1, color, strokeWidth }]);
        break;
      case DrawAction.Text:
        setTexts((prev) => [...prev,{id, x, y, text:inputText , frontsize: 20, fill: color}]);
        break;
    }}
  }, [drawAction, color, strokeWidth]);
  
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
      case DrawAction.Text:
        setTexts((prev) =>
          prev.map((texts) =>
            texts.id === currentShapeRef.current ? { ...texts} : texts
          )
        );
        break;
    }
  }, [drawAction]);

  function handleClick(e){

    console.log(triangles)

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
        if (eraserMode) {
          setColor(previousColor); 
        }
        setEraserMode(false);
        break;
      case "circle":
        setCircleBtn(true);
        setDrawAction(DrawAction.Circle);
        if (eraserMode) {
          setColor(previousColor); 
        }
        setEraserMode(false);
        break;
      case "square":
        setSquareBtn(true);
        setDrawAction(DrawAction.Rectangle);
        if (eraserMode) {
          setColor(previousColor); 
        }
        setEraserMode(false);

        break;
      case "ellipse":
        setEllipseBtn(true);
        setDrawAction(DrawAction.Ellipse);
        if (eraserMode) {
          setColor(previousColor); 
        }
        setEraserMode(false);
        break;
      case "brush":
        setBrushBtn(true);
        setDrawAction(DrawAction.Scribble);
        if (eraserMode) {
          setColor(previousColor); 
        }
        setEraserMode(false);
        break;
      case "eraser":
        setEraseBtn(true);
        setDrawAction(DrawAction.Scribble);
        if (!eraserMode) {
          setPreviousColor(color); 
        }
        setEraserMode(true); 
        setColor('white');
        break;

        case "triangle":
          setTriangleBtn(true);
          setDrawAction(DrawAction.Triangle);
          if (eraserMode) {
            setColor(previousColor);
          }
          setEraserMode(false);
          break;
        case "text":
            setTextBtn(true);
            setDrawAction(DrawAction.Text);
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
              <i id={"arrow"} className="arrow bi bi-arrow-up-right"></i>
            </button>

            <button id={"circle"} className={"circle btn " + (circleBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
              <i id={"circle"} className={"circle bi bi-circle"}/>
            </button>

            <button id={"square"} className={"square btn " + (squareBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
              <i id={"square"} className="square bi bi-square"></i>
            </button>

            <button id={"triangle"} className={"triangle btn " + (triangleBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}><i id={"triangle"} className="triangle bi bi-triangle"></i></button>

            <button id={"ellipse"} className={"ellipse btn " + (ellipseBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
              <svg id={"ellipse"} width={25} height={15} className={"ellipse"}>
                <ellipse id={"ellipse"} className={"ellipse"} cx="8" cy="5" rx="8" ry="4" stroke="black" strokeWidth="1" fill="none"/>
              </svg>
            </button>
          </div>

        </div>
        <hr></hr>

        <div className="component">
          <button id={"brush"} className={"brush btn " + (brushBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
            <label className='brush'><i id={"brush"} className="brush bi bi-brush"></i> Brush</label>
          </button>
        </div>

        <div className="component">
          <button id={"eraser"} className={"eraser btn " + (eraseBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
            <label className='eraser'><i id={"eraser"} className="eraser bi bi-eraser"></i> Eraser</label>
          </button>
        </div>


      <div className="component">
          <button id={"text"} className={"text btn " + (textBtn ? "btn-dark" : "btn-outline-dark")} onClick={handleClick}>
            <label className='text'><i id={"text"} className="text bi bi-fonts"></i> Add text</label>
          </button>
          <input type='text' className={(textBtn ? "" : "hidden")} onChange={(e) => {setinputText(e.target.value); setDrawAction(inputText);}}>
          </input>
      </div>

        <hr></hr>

          <div className="component">
          <input className={"form-control form-control-color"} type="color" id="favcolor" onChange={(e) => setColor(e.target.value)} ></input>
          <label htmlFor="favcolor">  Color</label>
          </div>

          <div className="component">
          <label htmlFor="size">Thickness</label>
          <input className={"form-range"} type="range" id="size"
          min="1"
          max="10"
          value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))}></input>
          </div>

          <hr></hr>

<div className="component">
  <button 
    id="transform" 
    className={"transform btn " + (textBtn ? "btn-dark" : "btn-outline-dark")} 
    onClick={() => setDrawAction(DrawAction.Select)}
  >
    <label className='transform'><i id={"transform"} className="transform bi bi-arrows-move"></i> Select</label>
  </button>
</div>
<div className="component">
  <button
    id="copy"
    className={"btn btn-outline-dark"}
    onClick={onCopyShape}
  >
    <i className="bi bi-files"></i> Copy
  </button>
</div>

          <div className="component">
          <button className={"btn btn-outline-dark"} id="clear" onClick={handleClear}>
            <i className="bi bi-trash"></i> clear
          </button>
          </div>

          <div className="component">
          <button id="undo" className="btn btn-outline-dark" onClick={handleUndo}>
            <i className="bi bi-arrow-counterclockwise"></i> Undo
          </button>
          </div>
          <div className="component">
          <button id="redo" className="btn btn-outline-dark" onClick={handleRedo}>
           <i className="bi bi-arrow-clockwise"></i> Redo
          </button>
          </div>

        <div className="component">
          <button id="save" className={"btn btn-outline-dark"}><i className="bi bi-floppy"></i> save</button>
        </div>

      </section>

      <div className="screen">
        <Stage
          width={window.innerWidth*0.9}
          height={window.innerHeight}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          onMouseUp={onStageMouseUp}
          ref={stageRef}
        >
          <Layer>
            {scribbles.map((scribble) => (
              <KonvaLine key={scribble.id} points={scribble.points} stroke={scribble.color} strokeWidth={scribble.strokeWidth}/>
            ))}
            {circles.map((circle) => (
              <KonvaCircle key={circle.id} x={circle.x} y={circle.y} radius={circle.radius} stroke={circle.color} strokeWidth={circle.strokeWidth}  draggable
              onDragMove={(e) => {
                const { x, y } = e.target.position();
                setCircles((prev) =>
                  prev.map((c) => (c.id === circle.id ? { ...c, x, y } : c))
                );
              }}
              onClick={onShapeClick}
              type="circle"  
              id={circle.id}
              />
            ))}
            {rectangles.map((rectangle) => (
              <KonvaRect key={rectangle.id} x={rectangle.x} y={rectangle.y} width={rectangle.width} height={rectangle.height}  stroke={rectangle.color} strokeWidth={rectangle.strokeWidth}  draggable
              onDragMove={(e) => {
                const { x, y } = e.target.position();
                setRectangles((prev) =>
                  prev.map((r) => (r.id === rectangle.id ? { ...r, x, y } : r))
                );
                
              }}
              
              onClick={onShapeClick}
              id={rectangle.id}
              type="rectangle" 
              
              />
            ))}
            {arrows.map((arrow) => (
              <KonvaArrow key={arrow.id} points={arrow.points} stroke={arrow.color} strokeWidth={arrow.strokeWidth} draggable
              onDragMove={(e) => {
                const { x, y } = e.target.position();
                const dx = x - arrow.points[0];
                const dy = y - arrow.points[1];
                setArrows((prev) =>
                  prev.map((a) =>
                    a.id === arrow.id
                      ? { ...a, points: [x, y, a.points[2] + dx, a.points[3] + dy] }
                      : a
                  )
                );
              }}
              
              onClick={onShapeClick}
              type="arrow" 
              id={arrow.id}/>
            ))}
            {triangles.map((triangle) => (
              <KonvaTriangle key={triangle.id} x={triangle.x} y={triangle.y} sides={3} radius={Math.sqrt(triangle.width ** 2 + triangle.height ** 2)} stroke={triangle.color} strokeWidth={triangle.strokeWidth}   draggable
              onDragMove={(e) => {
                const { x, y } = e.target.position();
                setTriangles((prev) =>
                  prev.map((t) => (t.id === triangle.id ? { ...t, x, y } : t))
                );
              }}
              onClick={onShapeClick}
              type="triangle" 
              id={triangle.id}
              />
            ))}
            {ellipses.map((ellipse) => (
              <KonvaEllipse key={ellipse.id} x={ellipse.x} y={ellipse.y} radiusX={ellipse.radiusX} radiusY={ellipse.radiusY}  stroke={ellipse.color} strokeWidth={ellipse.strokeWidth}  draggable
              onDragMove={(e) => {
                const { x, y } = e.target.position();
                setEllipses((prev) =>
                  prev.map((el) => (el.id === ellipse.id ? { ...el, x, y } : el))
                );
              }}
              onClick={onShapeClick}
              type="ellipse" 
              id={ellipse.id}
              />
            ))}
            {texts.map((text) => (
              <KonvaText
                key={text.id}
                x={text.x}
                y={text.y}
                text={text.text}
                fontSize={text.fontSize}
                fill={text.fill}
                draggable
              />
            ))}
<Transformer
  ref={transformerRef}
  boundBoxFunc={(oldBox, newBox) => {
    return newBox;
  }}
/>
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
export default App;