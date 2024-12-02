package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import lombok.Getter;
import org.springframework.stereotype.Component;

import javax.xml.bind.annotation.XmlRootElement;

@Getter
@Component
@XmlRootElement
public class Square extends Shape implements Shape1,Cloneable{
    double width=1;
    double height=1;

    @XmlElement
    public double getWidth() {
        return width;
    }

    @XmlElement
    public double getHeight() {
        return height;
    }
    public Square(){
        super();
    }

    public Square(String id,double x, double y, String color, double strokeWidth) {
        super(x, id, y, color, strokeWidth);

    }

    @Override
    public Square clone() {

        Square clone = (Square) super.clone();
        // TODO: copy mutable state here, so the clone can't change the internals of the original
        clone.width=width;
        clone.height=height;

        return clone;

    }
}
