package com.example.paint.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.xml.bind.annotation.*;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;

@Component
@Setter
@XmlRootElement
public class Canvas {
    public ArrayList<Rect> rect = new ArrayList<>();
    public ArrayList<Circle> circle = new ArrayList<>();
    public ArrayList<Square> square = new ArrayList<>();
    public ArrayList<Triangle> triangle = new ArrayList<>();
    public ArrayList<Line> line = new ArrayList<>();



//    @XmlAnyElement(lax = true)
//    public ArrayList<Rect> getRects() {
//        return rects;
//    }
//
//    @XmlAnyElement(lax = true)
//    public ArrayList<Line> getLines() {
//        return lines;
//    }
//
//    @XmlAnyElement(lax = true)
//    public ArrayList<Circle> getCircles() {
//        return circles;
//    }
//
//    @XmlAnyElement(lax = true)
//    public ArrayList<Square> getSquares() {
//        return squares;
//    }
//
//    @XmlAnyElement(lax = true)
//    public ArrayList<Triangle> getTriangles() {
//        return triangles;
//    }
}
