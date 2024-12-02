package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import org.springframework.stereotype.Component;


@Component
@XmlRootElement
@Getter
public class Rect extends Shape implements Shape1,Cloneable {
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
    public Rect(){
        super();
    }

    public Rect(String id,double x, double y, String color, double strokeWidth) {
        super(x, id, y, color, strokeWidth);

    }

    @Override
    public Rect clone() {

        Rect clone = (Rect) super.clone();
        // TODO: copy mutable state here, so the clone can't change the internals of the original
        clone.width=width;
        clone.height=height;

        return clone;

    }
}
