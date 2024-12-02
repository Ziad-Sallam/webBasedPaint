package com.example.paint.model;
import jakarta.xml.bind.annotation.XmlElement;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;
import javax.xml.bind.annotation.XmlRootElement;

@Setter
@Getter
@Component
@XmlRootElement
public class Ellipse extends Shape implements Shape1,Cloneable {
    double radiusX=1;
    double radiusY=1;

    @XmlElement
    public double getRadiusX() {
        return radiusX;
    }

    @XmlElement
    public double getRadiusY() {
        return radiusY;
    }
    public Ellipse() {
        super();
    }
    public Ellipse(String id,double x, double y, String color, double strokeWidth) {
        super(x, id, y, color, strokeWidth);
    }

    @Override
    public Ellipse clone() {

        Ellipse clone = (Ellipse) super.clone();
        // TODO: copy mutable state here, so the clone can't change the internals of the original
        clone.radiusX=radiusX;
        clone.radiusY=radiusY;
        return clone;

    }
}
