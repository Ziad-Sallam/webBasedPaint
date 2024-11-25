package com.example.paint.model;

import org.springframework.stereotype.Component;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;

@Component
@XmlRootElement
public class Scribble extends Shape {
    ArrayList<Double> points;

    @XmlElement
    public ArrayList<Double> getPoints() {
        return points;
    }
}

