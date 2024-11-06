package com.example.paint.service;
import java.io.File;

import com.example.paint.model.*;
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
}

class test{
    public static void main(String[] args) {
        SaveLoad sl = new SaveLoad();
        Canvas c = new Canvas();
        Triangle t = new Triangle();
        t.setY(3);
        t.setX(5);
        t.setFill("red");
        Rect r = new Rect();
        r.setX(10);
        r.setY(10);
        r.setFill("blue");
        Circle circle = new Circle();
        circle.setX(10);
        circle.setY(10);
        circle.setFill("green");
        circle.setRadius(7);
        c.circle.add(circle);
        c.rect.add(r);
        c.triangle.add(t);
        sl.saveXml(c,3);
    }

}


