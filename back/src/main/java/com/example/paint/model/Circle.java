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
    int radius;
    @XmlElement
    public int getRadius() {
        return radius;
    }
}
