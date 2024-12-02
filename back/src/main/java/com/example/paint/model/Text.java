package com.example.paint.model;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Component
@XmlRootElement
public class Text extends Shape implements Shape1,Cloneable{
    public String text;
    public double fontSize;

    @XmlElement
    public String getText(){
        return text;
    }

    @XmlElement
    public double getFontSize(){
        return fontSize;
    }
    public Text() {
        super();
    }
    public Text(String id,double x, double y, String color, double strokeWidth, String text) {
        super(x, id, y, color, strokeWidth);
        fontSize = 10*strokeWidth;
        this.text = text;

    }


    @Override
    public Text clone() {

            Text clone = (Text) super.clone();
            // TODO: copy mutable state here, so the clone can't change the internals of the original
            clone.text = text;
            clone.fontSize = fontSize;
            return clone;

    }
}
