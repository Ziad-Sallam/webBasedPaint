package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.xml.bind.annotation.XmlRootElement;

@Component
@XmlRootElement
@Setter
public class Shape {
    int x;
    int y;
    String stroke;
    int strokeWidth;
    String fill;

    @XmlElement
    public int getX() {
        return x;
    }

    @XmlElement
    public int getY() {
        return y;
    }
    @XmlElement
    public String getStroke() {
        return stroke;
    }
    @XmlElement
    public int getStrokeWidth() {
        return strokeWidth;
    }
    @XmlElement
    public String getFill() {
        return fill;
    }

}
