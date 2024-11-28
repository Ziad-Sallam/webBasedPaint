package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import org.springframework.stereotype.Component;

@Component
@XmlRootElement
public class Text extends Shape {
    public String text;
    public double fontsize;

    @XmlElement
    public String getText(){
        return text;
    }

    @XmlElement
    public double getFontsize(){
        return fontsize;
    }


}
