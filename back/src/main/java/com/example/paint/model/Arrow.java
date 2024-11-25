package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@XmlRootElement
public class Arrow extends Shape {
    ArrayList<Double> points;

    @XmlElement
    public ArrayList<Double> getPoints() {
        return points;
    }
}
