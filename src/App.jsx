import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Transformer } from 'react-konva';
import {saveAs} from 'file-saver'
import axios from "axios";
import './App.css'
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
    Line: 'Line',
    Square: 'Square',
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
    const [squares, setSquares] = useState([]);
    const [arrows, setArrows] = useState([]);
    const [triangles, setTriangles] = useState([]);
    const [ellipses, setEllipses] = useState([]);
    const [texts, setTexts] = useState([]);
    const [lines, setLines] = useState([]);
    const [inputText, setinputText] = useState("");

    const [circleBtn, setCircleBtn] = useState(false);
    const [squareBtn, setSquareBtn] = useState(false);
    const [triangleBtn, setTriangleBtn] = useState(false);
    const [ellipseBtn, setEllipseBtn] = useState(false);
    const [lineBtn, setLineBtn] = useState(false);
    const [arrowBtn, setArrowBtn] = useState(false);
    const [brushBtn, setBrushBtn] = useState(true);
    const [eraseBtn, setEraseBtn] = useState(false);
    const [textBtn, setTextBtn] = useState(false);
    const [rectangleBtn, setRectangleBtn] = useState(false);
    const stageRef = useRef(null);
    const isDrawingRef = useRef(false);
    const currentShapeRef = useRef(null);
    const transformerRef = useRef(null);
    const [selectedShape, setSelectedShape] = useState(null);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    const onShapeClick = useCallback(
        (e) => {
            if (drawAction !== DrawAction.Select) {
                setSelectedShape(null);
                transformerRef.current.nodes([]);
                transformerRef.current.getLayer()?.batchDraw();
                return;
            }
            const currentTarget = e.target;
            const shapeType = currentTarget.attrs.type;
            setSelectedShape({
                shape: currentTarget,
                type: shapeType,
                id: currentTarget.attrs.id,
            });
            transformerRef.current.nodes([currentTarget]);
            transformerRef.current.getLayer()?.batchDraw();
        },
        [drawAction]
    );
    useEffect(() => {
        if (drawAction !== DrawAction.Select) {
            setSelectedShape(null);
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [drawAction]);
    const applyColor = () => {

        if (selectedShape) {
            selectedShape.shape.fill(color);
            selectedShape.shape.getLayer().draw();
        }

    };

    const onCopyShape = () => {
        if (!selectedShape) return;
        const { type, shape } = selectedShape;
        const { x, y, width, height, radius, stroke, strokeWidth, points, sides} = shape.attrs;
        let shapeCopy = { ...shape.attrs };
        if (type === 'arrow' || type == 'line') {
            shapeCopy.points = points.map((point, index) =>
                index % 2 === 0 ? point + 20 : point + 20
            );
        } else {
            shapeCopy.x = (x || 0) + 20;
            shapeCopy.y = (y || 0) + 20;
        }

        shapeCopy.color = shapeCopy.stroke;
        const newShape = { ...shapeCopy, id: uuidv4() };
        saveStateToUndoStack();
        switch (type) {
            case 'line':
                setLines((prev) => [...prev, newShape]);
                break;
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
            case 'square':
                setSquares((prev) => [...prev, newShape]);
                break;
            default:
                break;
        }
        setSelectedShape(null);
    };
    useEffect(() => {
        if (!selectedShape) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [selectedShape]);

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
        }else if(type==="arrow"){
            setArrows((prevarrows)=>prevarrows.filter((arr=>arr.id!=id))
            )
        }else if(type==="line"){
            setLines((prevlines)=>prevlines.filter((line=>line.id!=id))
            )
        }
        else if(type==="ellipse"){
            setEllipses((preveli)=>preveli.filter((eli=>eli.id!=id))
            )
        }else if(type==="triangle"){
            setTriangles((prevtri)=>prevtri.filter((tri=>tri.id!=id))
            )
        }
        else if(type==="square"){
            setSquares((prevRectangles) =>
                prevRectangles.filter((rect) => rect.id!== id)
            );
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
        setLines([]);
        setArrows([]);
        setEllipses([]);
        setTriangles([]);
        setTexts([]);
        setSquares([]);
    };
    const saveStateToUndoStack = () => {
        console.log("saved");
        setUndoStack((prev) => [
            ...prev,
            {
                scribbles,
                lines,
                circles,
                rectangles,
                arrows,
                triangles,
                ellipses,
                texts,
                squares,
            },
        ]);
        setRedoStack([]);
    };

    const handleUndo = () => {
        console.log("undo");
        if (undoStack.length === 0) return;
        const lastState = undoStack[undoStack.length - 1];
        setRedoStack((prev) => [
            ...prev,
            {
                scribbles,
                lines,
                circles,
                rectangles,
                arrows,
                triangles,
                ellipses,
                texts,
                squares
            },
        ]);
        setScribbles(lastState.scribbles);
        setLines(lastState.lines);
        setCircles(lastState.circles);
        setRectangles(lastState.rectangles);
        setArrows(lastState.arrows);
        setTriangles(lastState.triangles);
        setEllipses(lastState.ellipses);
        setTexts(lastState.texts);
        setSquares(lastState.squares);
        transformerRef.current.nodes([]);
        setUndoStack((prev) => prev.slice(0, -1));
    };

    const handleRedo = () => {
        console.log("redo");
        if (redoStack.length === 0) return;
        const nextState = redoStack[redoStack.length - 1];
        setUndoStack((prev) => [
            ...prev,
            {
                scribbles,
                lines,
                circles,
                rectangles,
                arrows,
                triangles,
                ellipses,
                texts,
                squares,
            },
        ]);
        setScribbles(nextState.scribbles);
        setLines(nextState.lines);
        setCircles(nextState.circles);
        setRectangles(nextState.rectangles);
        setArrows(nextState.arrows);
        setTriangles(nextState.triangles);
        setEllipses(nextState.ellipses);
        setTexts(nextState.texts);
        setSquares(nextState.squares);
        transformerRef.current.nodes([]);
        setRedoStack((prev) => prev.slice(0, -1));
    };

    async function load(){
        try{
            const response = await axios.get('http://localhost:5000/load',{
                params: { slot: 2}
            });
            const data =  response.data;
            console.log(data);
            setCircles(data.circle);
            setRectangles(data.rect)
            setArrows(data.arrow)
            setEllipses(data.ellipse)
            setScribbles(data.scribble)
            setTriangles(data.triangle)
            setTexts(data.text)

        }catch(err){
            console.log("error message: ${err.message}");
        }
    }


    async function save(){
        console.log("hello :)")
        const canvas = {
            rect : rectangles,
            circle : circles,
            triangle:triangles,
            arrow:arrows,
            ellipse:ellipses,
            scribble: scribbles,
            text: texts
        };
        console.log(canvas);
        try {
            await axios.post('http://localhost:5000/save',canvas)
        }catch(err){
            console.log("error message: ${err.message}");
        }
        // Create a Blob from the JSON data
        const blob = new Blob([JSON.stringify(canvas, null, 2)], { type: 'application/json' });

        // Define the filename and save the file
        const filename = 'data.json';
        saveAs(blob, filename);
    }


    const fileRef = useRef(null);
    function handleFileChange(e){
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) =>{
            const content = e.target.result;
            const data = JSON.parse(content);
            console.log(data);
            setCircles(data.circle);
            setRectangles(data.rect)
            setArrows(data.arrow)
            setEllipses(data.ellipse)
            setScribbles(data.scribble)
            setTriangles(data.triangle)
            setTexts(data.text)

        };
        reader.readAsText(file);
        fileRef.current.value ='';
    }
    const requestShape = async (str,id,x,y,strokeWidth,color,text) =>{

        try{
            const response = await axios.get('http://localhost:5000/create',
                {params:{shape: str,
                        id: id,
                        x:x,
                        y:y,
                        strokeWidth: strokeWidth,
                        color:color,
                        text:text,

                    }}
            )
            console.log("++++++++++++++++++++++++++++++++++++++++++++")
            console.log(response.data);
            return response.data;

        }catch(err){
            console.log("error message: ${err.message}");
        }
        return null

    }

    const layerRef = useRef(null);
    const onStageMouseDown = useCallback(async (e) => {
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
                case DrawAction.Scribble: {
                    const data = await requestShape("scribble", id, x, y, strokeWidth, color, "");
                    setScribbles((prev) => [...prev, data]);
                    break;
                }
                case DrawAction.Circle: {
                    const data = await requestShape("circle", id, x, y, strokeWidth, color, "");
                    setCircles((prev) => [...prev, data]);
                    break;
                }
                case DrawAction.Rectangle: {
                    const data = await requestShape("rectangle", id, x, y, strokeWidth, color, "");
                    setRectangles((prev) => [...prev, data]);
                    break;
                }
                case DrawAction.Square: {
                    const data = await requestShape("square", id, x, y, strokeWidth, color, "");
                    setSquares((prev) => [...prev, data]);
                    break;
                }
                case DrawAction.Arrow: {
                    const data = await requestShape("arrow", id, x, y, strokeWidth, color, "");
                    setArrows((prev) => [...prev, data]);
                    break;
                }
                case DrawAction.Line: {
                    const data = await requestShape("line", id, x, y, strokeWidth, color, "");
                    setLines((prev) => [...prev, data]);
                    break;
                }
                case DrawAction.Triangle: {
                    const data = await requestShape("triangle", id, x, y, strokeWidth, color, "");
                    setTriangles((prev) => [...prev, data]);
                    break;
                }
                case DrawAction.Ellipse: {
                    const data = await requestShape("ellipse", id, x, y, strokeWidth, color, "");
                    setEllipses((prev) => [...prev, data]);
                    break;
                }
                case DrawAction.Text: {
                    const data = await requestShape("text", id, x, y, strokeWidth, color, inputText);
                    setTexts((prev) => [...prev, data]);
                    break;
                }
            }}
    }, [drawAction, color, strokeWidth]);

    const onStageMouseMove = useCallback(() => {
        if (!isDrawingRef.current) return;
        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        const x = pos.x;
        const y = pos.y;

        switch (drawAction) {
            case DrawAction.Line:
                setLines((prev) =>
                    prev.map((line) =>
                        line.id === currentShapeRef.current
                            ? { ...line, points: [line.points[0], line.points[1], x, y] }
                            : line
                    )
                );
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
                        triangle.id === currentShapeRef.current ? { ...triangle, radius: Math.sqrt((x - triangle.x) ** 2 + (y - triangle.y) ** 2), } : triangle
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
            case DrawAction.Square:
                setSquares((prev) =>
                    prev.map((square) =>
                        square.id === currentShapeRef.current ? { ...square, width: x - square.x, height: x - square.x } : square
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
        setLineBtn(false);
        setRectangleBtn(false)
        switch(btnId || x) {
            case "line":
                setLineBtn(true);
                setDrawAction(DrawAction.Line);
                if (eraserMode) {
                    setColor(previousColor);
                }
                setEraserMode(false);
                break;
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
                setDrawAction(DrawAction.Square);
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
                if (eraserMode) {
                    setColor(previousColor);
                }
                setEraserMode(false);
                break;
            case "rectangle":
                setDrawAction(DrawAction.Rectangle)
                setRectangleBtn(true)
                if (eraserMode) {
                    setColor(previousColor);
                }
                setEraserMode(false);
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
                        <button id={"line"} className={"line btn " + (lineBtn ? "btn-dark" : "btn-outline-dark")}
                                onClick={handleClick}>
                            <i className="bi bi-slash-lg"></i>
                        </button>
                        <button id={"arrow"} className={"arrow btn " + (arrowBtn ? "btn-dark" : "btn-outline-dark")}
                                onClick={handleClick}>
                            <i id={"arrow"} className="arrow bi bi-arrow-up-right"></i>
                        </button>

                        <button id={"circle"} className={"circle btn " + (circleBtn ? "btn-dark" : "btn-outline-dark")}
                                onClick={handleClick}>
                            <i id={"circle"} className={"circle bi bi-circle"}/>
                        </button>

                        <button id={"rectangle"}
                                className={"rectangle btn " + (rectangleBtn ? "btn-dark" : "btn-outline-dark")}
                                onClick={handleClick}>
                            <i id={"rectangle"} className="bi bi-phone-landscape"></i>
                        </button>

                        <button id={"triangle"}
                                className={"triangle btn " + (triangleBtn ? "btn-dark" : "btn-outline-dark")}
                                onClick={handleClick}><i id={"triangle"} className="triangle bi bi-triangle"></i>
                        </button>

                        <button id={"ellipse"}
                                className={"ellipse btn " + (ellipseBtn ? "btn-dark" : "btn-outline-dark")}
                                onClick={handleClick}>
                            <svg id={"ellipse"} width={25} height={15} className={"ellipse"}>
                                <ellipse id={"ellipse"} className={"ellipse"} cx="8" cy="5" rx="8" ry="4" stroke="black"
                                         strokeWidth="1" fill="none"/>
                            </svg>
                        </button>

                        <button id={"square"} className={"square btn " + (squareBtn ? "btn-dark" : "btn-outline-dark")}
                                onClick={handleClick}>
                            <i id={"square"} className="square bi bi-square"></i>
                        </button>
                    </div>

                </div>
                <hr></hr>

                <div className="component">
                    <button id={"brush"} className={"brush btn " + (brushBtn ? "btn-dark" : "btn-outline-dark")}
                            onClick={handleClick}>
                        <label className='brush'><i id={"brush"} className="brush bi bi-brush"></i> Brush</label>
                    </button>
                </div>

                <div className="component">
                    <button id={"eraser"} className={"eraser btn " + (eraseBtn ? "btn-dark" : "btn-outline-dark")}
                            onClick={handleClick}>
                        <label className='eraser'><i id={"eraser"} className="eraser bi bi-eraser"></i> Eraser</label>
                    </button>
                </div>


                <div className="component">
                    <button id={"text"} className={"text btn " + (textBtn ? "btn-dark" : "btn-outline-dark")}
                            onClick={handleClick}>
                        <label className='text'><i id={"text"} className="text bi bi-fonts"></i> Add text</label>
                    </button>
                    <input type='text' className={(textBtn ? "" : "hidden")} onChange={(e) => {
                        setinputText(e.target.value);
                        setDrawAction(inputText);
                    }}>
                    </input>
                </div>
                <hr></hr>
                <div className="component">
                    <input className={"form-control form-control-color"} type="color" id="favcolor"
                           onChange={(e) => setColor(e.target.value)}></input>
                    <label htmlFor="favcolor"> Color</label>
                </div>
                <button onClick={applyColor}>Fill Color</button>
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
                        <label className='transform'><i id={"transform"}
                                                        className="transform bi bi-arrows-move"></i> Select</label>
                    </button>
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
                    <button id="undo" className="btn btn-outline-dark" onClick={handleUndo}>
                        <i className="bi bi-arrow-counterclockwise"></i> Undo
                    </button>
                </div>
                <div className="component">
                    <button id="redo" className="btn btn-outline-dark" onClick={handleRedo}>
                        <i className="bi bi-arrow-clockwise"></i> Redo
                    </button>
                    <button id="save" className={"btn btn-outline-dark"} onClick={save}><i
                        className="bi bi-floppy"></i> save
                    </button>
                </div>
                <input type={"file"} onChange={handleFileChange} accept={".json"} ref={fileRef}/>
                <button id="load" className={"btn btn-outline-dark"} onClick={load}><i
                    className="bi bi-floppy"></i> load
                </button>


            </section>

            <div className="screen">
                <Stage
                    width={850}
                    height={700}
                    onMouseDown={onStageMouseDown}
                    onMouseMove={onStageMouseMove}
                    onMouseUp={onStageMouseUp}
                    ref={stageRef}
                >
                    <Layer>
                        {scribbles.map((scribble) => (
                            <KonvaLine key={scribble.id} points={scribble.points} stroke={scribble.color} strokeWidth={scribble.strokeWidth} draggable={selectedShape?.id === scribble.id}/>
                        ))}

                        {squares.map((square) => (<KonvaRect key={square.id} x={square.x} y={square.y} width={square.width} height={square.height} stroke={square.color} strokeWidth={rectangle.strokeWidth}
                                                             draggable={selectedShape?.id === square.id}
                                                             onDragStart={(e)=>{saveStateToUndoStack();}}
                                                             onDragMove={(e) => {const { x, y } = e.target.position();
                                                                 setSquares((prev) =>prev.map((r) => (r.id === square.id ? { ...r, x, y } : r)));}}
                                                             onDragEnd={(e)=>{saveStateToUndoStack();}}
                                                             onTransformStart={(e)=>{saveStateToUndoStack();}}
                                                             onTransformEnd={(e) => {const node = e.target;
                                                                 const newWidth = node.width() * node.scaleX();
                                                                 const newHeight = node.height() * node.scaleY();
                                                                 saveStateToUndoStack();
                                                                 setSquares((prev) => prev.map((r) =>r.id === square.id
                                                                     ? { ...r,  width: newWidth, height: newWidth,x: node.x(),y: node.y(),}:r));
                                                                 node.scaleX(1);
                                                                 node.scaleY(1);
                                                             }}
                                                             onClick={onShapeClick}
                                                             type="square"
                                                             id={square.id}/>))}


                        {circles.map((circle) => (
                            <KonvaCircle
                                key={circle.id}
                                x={circle.x}
                                y={circle.y}
                                radius={circle.radius}
                                stroke={circle.color}
                                strokeWidth={circle.strokeWidth}
                                draggable={selectedShape?.id === circle.id}
                                onDragStart={(e)=>{
                                    saveStateToUndoStack();}}
                                onDragMove={(e) => {
                                    const { x, y } = e.target.position();
                                    setCircles((prev) =>
                                        prev.map((c) => (c.id === circle.id ? { ...c, x, y } : c))
                                    );
                                }}
                                onDragEnd={(e)=>{
                                    saveStateToUndoStack();}}
                                onTouchStart={(e)=>{
                                    saveStateToUndoStack();}}
                                onTransformEnd={(e) => {
                                    const node = e.target;
                                    const newRadius = Math.max(node.width() * node.scaleX(), node.height() * node.scaleY()) / 2;
                                    saveStateToUndoStack();
                                    setCircles((prev) =>
                                        prev.map((c) =>
                                            c.id === circle.id
                                                ? { ...c, radius: newRadius, x: node.x(), y: node.y() }
                                                : c
                                        )
                                    );
                                    node.scaleX(1);
                                    node.scaleY(1);
                                }}
                                onClick={onShapeClick}
                                type="circle"
                                id={circle.id}
                            />
                        ))}

                        {rectangles.map((rectangle) => (<KonvaRect key={rectangle.id} x={rectangle.x} y={rectangle.y} width={rectangle.width} height={rectangle.height} stroke={rectangle.color}
                                                                   strokeWidth={rectangle.strokeWidth}
                                                                   draggable={selectedShape?.id === rectangle.id}
                                                                   onDragStart={(e)=>{
                                                                       saveStateToUndoStack();}}
                                                                   onDragMove={(e) => {
                                                                       const { x, y } = e.target.position();
                                                                       setRectangles((prev) =>
                                                                           prev.map((r) => (r.id === rectangle.id ? { ...r, x, y } : r))
                                                                       );
                                                                   }}
                                                                   onDragEnd={(e)=>{
                                                                       saveStateToUndoStack();}}
                                                                   onTransformStart={(e)=>{
                                                                       saveStateToUndoStack();}}
                                                                   onTransformEnd={(e) => {
                                                                       const node = e.target;
                                                                       const newWidth = node.width() * node.scaleX();
                                                                       const newHeight = node.height() * node.scaleY();
                                                                       saveStateToUndoStack();
                                                                       setRectangles((prev) =>
                                                                           prev.map((r) =>
                                                                               r.id === rectangle.id
                                                                                   ? {
                                                                                       ...r,
                                                                                       width: newWidth,
                                                                                       height: newHeight,
                                                                                       x: node.x(),
                                                                                       y: node.y(),
                                                                                   }
                                                                                   : r
                                                                           )
                                                                       );
                                                                       node.scaleX(1);
                                                                       node.scaleY(1);

                                                                   }}
                                                                   onClick={onShapeClick}
                                                                   type="rectangle"
                                                                   id={rectangle.id}
                            />
                        ))}
                        {lines.map((line) => (
                            <KonvaLine
                                key={line.id}
                                points={line.points}
                                stroke={line.color}
                                strokeWidth={line.strokeWidth}
                                draggable={selectedShape?.id === line.id}
                                onDragStart={(e)=>{
                                    saveStateToUndoStack();}}
                                onDragMove={(e) => {
                                    const { x, y } = e.target.position();
                                    const dx = x - line.points[0];
                                    const dy = y - line.points[1];
                                    setLines((prev) =>
                                        prev.map((l) =>
                                            l.id === line.id
                                                ? { ...l, points: [x, y, l.points[2] + dx, l.points[3] + dy] }
                                                : l
                                        )
                                    );
                                }}
                                onDragEnd={(e)=>{
                                    saveStateToUndoStack();}}
                                onTransformStart={(e)=>{
                                    saveStateToUndoStack();}}
                                onTransformEnd={(e) => {
                                    const node = e.target;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();
                                    const newPoints = [
                                        line.points[0] * scaleX,
                                        line.points[1] * scaleY,
                                        line.points[2] * scaleX,
                                        line.points[3] * scaleY,
                                    ];
                                    saveStateToUndoStack();
                                    setLines((prev) =>
                                        prev.map((l) =>
                                            l.id === line.id
                                                ? {
                                                    ...l,
                                                    points: newPoints,
                                                    x: node.x(),
                                                    y: node.y(),
                                                }
                                                : l
                                        )
                                    );

                                    node.scaleX(1);
                                    node.scaleY(1);
                                }}
                                onClick={onShapeClick}
                                type="line"
                                id={line.id}
                            />
                        ))}

                        {arrows.map((arrow) => (
                            <KonvaArrow key={arrow.id} points={arrow.points} stroke={arrow.color} strokeWidth={arrow.strokeWidth} draggable={selectedShape?.id === arrow.id}
                                        onDragStart={(e)=>{
                                            saveStateToUndoStack();}}
                                        onDragMove={(e) => {
                                            const { x, y } = e.target.position();
                                            const dx = x - arrow.points[0];
                                            const dy = y - arrow.points[1];
                                            setArrows((prev) =>
                                                prev.map((a) =>
                                                    (a.id === arrow.id
                                                        ? { ...a, points: [x, y, a.points[2] + dx, a.points[3] + dy] }
                                                        : a)
                                                )
                                            );
                                        }}
                                        onDragEnd={(e)=>{
                                            saveStateToUndoStack();}}
                                        onTouchStart={(e)=>{
                                            saveStateToUndoStack();}}
                                        onTransformStart={(e)=>{
                                            saveStateToUndoStack();}}
                                        onTransformEnd={(e) => {
                                            const node = e.target;
                                            const scaleX = node.scaleX();
                                            const scaleY = node.scaleY();
                                            const newPoints = [
                                                arrow.points[0] * scaleX,
                                                arrow.points[1] * scaleY,
                                                arrow.points[2] * scaleX,
                                                arrow.points[3] * scaleY,
                                            ];
                                            saveStateToUndoStack();
                                            setArrows((prev) =>
                                                prev.map((a) =>
                                                    a.id === arrow.id
                                                        ? {
                                                            ...a,
                                                            points: newPoints,
                                                            x: node.x(),
                                                            y: node.y(),
                                                        }
                                                        : a
                                                )
                                            );

                                            node.scaleX(1);
                                            node.scaleY(1);
                                        }}
                                        onClick={onShapeClick}
                                        type="arrow"
                                        id={arrow.id}
                            />
                        ))}

                        {triangles.map((triangle) => (
                            <KonvaTriangle
                                key={triangle.id}
                                width={triangle.width}
                                height={triangle.height}
                                x={triangle.x}
                                y={triangle.y}
                                sides={3}
                                stroke={triangle.color}
                                strokeWidth={triangle.strokeWidth}
                                draggable={selectedShape?.id === triangle.id}
                                onDragStart={(e)=>{
                                    saveStateToUndoStack();}}
                                onDragMove={(e) => {
                                    const { x, y } = e.target.position();
                                    setTriangles((prev) =>
                                        prev.map((t) => (t.id === triangle.id ? { ...t, x, y } : t))
                                    );
                                }}
                                onDragEnd={(e)=>{
                                    saveStateToUndoStack();}}
                                onTouchStart={(e)=>{
                                    saveStateToUndoStack();}}
                                onTransformEnd={(e) => {
                                    const node = e.target;
                                    const newWidth = node.width() * node.scaleX();
                                    const newHeight = node.height() * node.scaleY();
                                    saveStateToUndoStack();
                                    setTriangles((prev) =>
                                        prev.map((t) =>
                                            t.id === triangle.id
                                                ? {
                                                    ...t,
                                                    width: newWidth,
                                                    height: newHeight,
                                                    x: node.x(),
                                                    y: node.y(),
                                                }
                                                : t
                                        )
                                    );
                                    node.scaleX(1);
                                    node.scaleY(1);
                                }}
                                onClick={onShapeClick}
                                type="triangle"
                                id={triangle.id}
                                radius={triangle.radius}
                            />
                        ))}


                        {ellipses.map((ellipse) => (
                            <KonvaEllipse
                                key={ellipse.id}
                                x={ellipse.x}
                                y={ellipse.y}
                                radiusX={ellipse.radiusX}
                                radiusY={ellipse.radiusY}
                                stroke={ellipse.color}
                                strokeWidth={ellipse.strokeWidth}
                                draggable={selectedShape?.id === ellipse.id}
                                onDragStart={(e)=>{
                                    saveStateToUndoStack();}}
                                onDragMove={(e) => {
                                    const { x, y } = e.target.position();
                                    setEllipses((prev) =>
                                        prev.map((el) => (el.id === ellipse.id ? { ...el, x, y } : el))
                                    );
                                }}
                                onDragEnd={(e)=>{
                                    console.log("dragged");
                                    saveStateToUndoStack();
                                }}
                                onTransformStart={(e)=>{
                                    saveStateToUndoStack();
                                }}
                                onTransformEnd={(e) => {
                                    console.log("transformed");
                                    const node = e.target;
                                    const newRadiusX = node.width() * node.scaleX() / 2;
                                    const newRadiusY = node.height() * node.scaleY() / 2;
                                    saveStateToUndoStack();
                                    setEllipses((prev) =>
                                        prev.map((el) =>
                                            el.id === ellipse.id
                                                ? {
                                                    ...el,
                                                    radiusX: newRadiusX,
                                                    radiusY: newRadiusY,
                                                    x: node.x(),
                                                    y: node.y(),
                                                }
                                                : el
                                        )
                                    );
                                    node.scaleX(1);
                                    node.scaleY(1);
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
                                draggable={selectedShape?.id === text.id}
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