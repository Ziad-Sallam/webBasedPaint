package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;
import javax.xml.bind.annotation.XmlElement;
import java.io.Serializable;

@Component
@Setter
@XmlRootElement
public class Circle extends Shape implements Shape1,Cloneable {
    double radius=1;
    @XmlElement
    public double getRadius() {
        return radius;
    }

    public Circle() {
        super();
    }
    public Circle(String id,double x, double y, String color, double strokeWidth) {
        super(x, id, y, color, strokeWidth);

    }


    @Override
    public Circle clone() {

        Circle clone = (Circle) super.clone();
        // TODO: copy mutable state here, so the clone can't change the internals of the original
        clone.radius = radius;
        return clone;

    }
}
