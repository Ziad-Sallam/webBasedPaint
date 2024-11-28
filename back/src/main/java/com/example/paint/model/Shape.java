package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.xml.bind.annotation.XmlRootElement;

@Component
@XmlRootElement
@Setter
public class Shape {
    String id;
    double x;
    double y;
    String color;
    double strokeWidth;

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

}
