package com.example.paint.model;

import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.sound.sampled.Line;
import javax.xml.bind.annotation.*;
import java.util.ArrayList;

@Component
@Setter
@XmlRootElement
public class Canvas {
    public ArrayList<Rect> rect = new ArrayList<>();
    public ArrayList<Circle> circle = new ArrayList<>();
    public ArrayList<Triangle> triangle = new ArrayList<>();
    public ArrayList<Scribble> scribble = new ArrayList<>();
    public ArrayList<Arrow> arrow = new ArrayList<>();
    public ArrayList<Ellipse> ellipse = new ArrayList<>();
    public ArrayList<Text> text = new ArrayList<>();
    public ArrayList<Square> Square = new ArrayList<>();
    public ArrayList<Line> Line = new ArrayList<>();

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
