package com.example.paint.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.Serializable;
import java.util.ArrayList;

@Component
@XmlRootElement
@Setter
@Getter
public class Scribble extends Shape implements Shape1,Cloneable {
    ArrayList<Double> points = new ArrayList<>();

    @XmlElement
    public ArrayList<Double> getPoints() {
        return points;
    }

    public Scribble() {
        super();

    }
    public Scribble(String id,double x, double y, String color, double strokeWidth) {
        super(x, id, y, color, strokeWidth);
        points.add(x);points.add(y);

    }

    @Override
    public Scribble clone() {

        Scribble clone = (Scribble) super.clone();
        // TODO: copy mutable state here, so the clone can't change the internals of the original
        clone.points = new ArrayList<>(points);
        return clone;

    }
}

