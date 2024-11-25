package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;
import javax.xml.bind.annotation.XmlElement;

@Component
@Setter
@XmlRootElement
public class Circle extends Shape {
    double radius;
    @XmlElement
    public double getRadius() {
        return radius;
    }
}
