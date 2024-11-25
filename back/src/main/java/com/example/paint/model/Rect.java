package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@XmlRootElement
public class Rect extends Shape {
    double width;
    double height;

    @XmlElement
    public double getWidth() {
        return width;
    }

    @XmlElement
    public double getHeight() {
        return height;
    }


}
