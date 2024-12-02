package com.example.paint.model;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@XmlRootElement
@Getter
public class Triangle extends Shape implements Shape1,Cloneable{

    double width=1;
    double height=1;
    double radius=1;

    @XmlElement
    public double getHeight() {
        return height;
    }

    @XmlElement
    public double getRadius(){
        return radius;
    }


    @XmlElement
    public double getWidth() {
        return width;
    }
    public Triangle() {
        super();
    }
    public Triangle(String id,double x, double y, String color, double strokeWidth) {
        super(x, id, y, color, strokeWidth);


    }

    @Override
    public Triangle clone() {
        Triangle clone = (Triangle) super.clone();
        // TODO: copy mutable state here, so the clone can't change the internals of the original
        clone.width=width;
        clone.height=height;
        return clone;

    }
}
