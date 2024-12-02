package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.xml.bind.annotation.XmlRootElement;

@Component
@XmlRootElement
@Setter
public class Shape implements Cloneable {
    String id="";
    double x =0;
    double y =0;
    String color = "";
    double strokeWidth = 0;


    @XmlElement
    public double getX() {
        return x;
    }

    @XmlElement
    public double getY() {
        return y;
    }

    @XmlElement
    public String getColor() {
        return color;
    }

    @XmlElement
    public double getStrokeWidth() {
        return strokeWidth;
    }

    @XmlElement
    public String getId() {
        return id;
    }

    public Shape() {
    }

    public Shape(double x, String id, double y, String color, double strokeWidth) {
        this.x = x;
        this.id = id;
        this.y = y;
        this.color = color;
        this.strokeWidth = strokeWidth;
    }


    public Shape clone() {
        try {
            Shape clone = (Shape) super.clone();
            // TODO: copy mutable state here, so the clone can't change the internals of the original
            clone.x = this.x;
            clone.y = this.y;
            clone.color = this.color;
            clone.strokeWidth = this.strokeWidth;
            clone.id = id;

            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
