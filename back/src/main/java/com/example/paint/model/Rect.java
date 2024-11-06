package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@XmlRootElement
public class Rect extends Shape {
    int width;
    int height;

    @XmlElement
    public int getWidth() {
        return width;
    }

    @XmlElement
    public int getHeight() {
        return height;
    }


}
