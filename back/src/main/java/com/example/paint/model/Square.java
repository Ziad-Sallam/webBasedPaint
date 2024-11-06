package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@XmlRootElement
public class Square extends Shape {
    int length;

    @XmlElement
    public int getLength() {
        return length;
    }
}
