package com.example.paint.service;
import java.awt.*;
import java.io.File;

import com.example.paint.model.*;
import com.example.paint.model.Canvas;
import com.example.paint.model.Shape;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.xml.bind.Marshaller;
import javax.xml.bind.JAXBException;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;

import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.ArrayList;

@Service
public class SaveLoad {
    public void saveJson(Canvas drawing,int slot) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
             objectMapper.writeValue(new File("back/save/"+slot +"/x.json"), drawing);
             System.out.println("Object has been serialized to person.json"); }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void saveXml(Canvas drawing,int slot) {
        try { // Create JAXB context and marshaller
            JAXBContext context = JAXBContext.newInstance(Canvas.class);
            Marshaller marshaller = context.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_ENCODING, "ISO-8859-1"); // Optional: Format the XML output
            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true); // Write the object to an XML file
            marshaller.marshal(drawing, new File("back/save/"+slot +"/x.xml")); // Write to console (for demonstration)
            marshaller.marshal(drawing, System.out);
        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    public Canvas LoadJson(int slot) {
        Canvas result = new Canvas();
        ObjectMapper objectMapper = new ObjectMapper();
        try{
            result = objectMapper.readValue(new File("back/save/"+slot +"/x.json"), Canvas.class);
            System.out.println(result);
        }
        catch (IOException e){
            e.printStackTrace();
        }
        return result;
    }

    public Canvas LoadXml(int slot) {
        Canvas result = new Canvas();
        try{
            JAXBContext context = JAXBContext.newInstance(Canvas.class);
            Unmarshaller unmarshaller = context.createUnmarshaller();

            File file = new File("back/save/"+slot +"/x.xml");
            result = (Canvas) unmarshaller.unmarshal(file);
        }
        catch (JAXBException e){
            e.printStackTrace();
        }
        return result;
    }

    public Shape1 create(String name,double x, String id, double y, String color, double strokeWidth, String text){
        if(name.equalsIgnoreCase("rectangle")){
            return new Rect(id,x,y,color,strokeWidth);
        }
        else if(name.equalsIgnoreCase("circle")){
            return new Circle(id,x,y,color,strokeWidth);
        }
        else if(name.equalsIgnoreCase("triangle")){
            return new Triangle(id,x,y,color,strokeWidth);
        }
        else if(name.equalsIgnoreCase("scribble")){
            return new Scribble(id,x,y,color,strokeWidth);

        }
        else if(name.equalsIgnoreCase("Text")){
            return new Text(id,x,y,color,strokeWidth,text);
        }
        else if(name.equalsIgnoreCase("ellipse")){
            return new Ellipse(id,x,y,color,strokeWidth);
        }
        else if(name.equalsIgnoreCase("arrow")){
            return new Arrow(id,x,y,color,strokeWidth);
        }
        else if(name.equalsIgnoreCase("line")){
            return new Line(id,x,y,color,strokeWidth);
        }
        if(name.equalsIgnoreCase("square")){
            return new Square(id,x,y,color,strokeWidth);
        }

        return null;
    }

    public Shape1 clone(Shape1 shape){
        return shape.clone();
    }

}

class test{
    public static void main(String[] args) {
        SaveLoad sl = new SaveLoad();
        Canvas c = new Canvas();
        Ellipse e = new Ellipse();
        e.setRadiusX(122);
        e.setRadiusY(100);
        c.ellipse.add(e);
        sl.saveJson(c,3);

    }

}


