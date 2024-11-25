package com.example.paint.model;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;

import org.springframework.stereotype.Component;

@Component
@XmlRootElement
public class Triangle extends Shape{

    double width;
    double height;

    @XmlElement
    public double getHeight() {
        return height;
    }

    @XmlElement
    public double getWidth() {
        return width;
    }


}
