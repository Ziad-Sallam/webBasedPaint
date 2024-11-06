package com.example.paint.model;

import org.springframework.stereotype.Component;

import javax.xml.bind.annotation.XmlElement;
import java.util.ArrayList;

@Component
public class Line extends Shape {
    ArrayList<Integer> points;

    @XmlElement
    public ArrayList<Integer> getPoints() {
        return points;
    }
}

