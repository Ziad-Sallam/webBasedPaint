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
public class Ellipse extends Shape {
    double radiusX;
    double radiusY;

    @XmlElement
    public double getRadiusX() {
        return radiusX;
    }

    @XmlElement
    public double getRadiusY() {
        return radiusY;
    }

}
