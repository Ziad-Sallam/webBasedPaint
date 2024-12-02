package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;
import java.util.ArrayList;

@Component
@XmlRootElement
@Setter
@Getter
public class Arrow extends Shape implements Shape1,Cloneable {
    ArrayList<Double> points = new ArrayList<>();

    @XmlElement
    public ArrayList<Double> getPoints() {
        return points;
    }

    public Arrow() {
        super();
    }
    public Arrow(String id,double x, double y, String color, double strokeWidth) {
        super(x, id, y, color, strokeWidth);
        points.add(x);points.add(y);points.add(x);points.add(y);

    }

    @Override
    public Arrow clone() {
        Arrow clone = (Arrow) super.clone();
        // TODO: copy mutable state here, so the clone can't change the internals of the original
        clone.points = new ArrayList<>(points);
        return clone;
    }
}
