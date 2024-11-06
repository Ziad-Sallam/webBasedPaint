package com.example.paint.model;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;

import org.springframework.stereotype.Component;

@Component
@XmlRootElement
public class Triangle extends Shape{
    int radius;

    @XmlElement
    public int getRadius() {
        return radius;
    }


}
