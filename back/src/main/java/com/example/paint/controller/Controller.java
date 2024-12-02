package com.example.paint.controller;


import com.example.paint.model.Shape1;
import com.example.paint.service.SaveLoad;
import com.example.paint.model.Canvas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin
public class Controller {
    @Autowired
    SaveLoad sl;

    @PostMapping(value = "/save")
    public void save(@RequestBody Canvas canvas) {
        sl.saveJson(canvas, 2);
        sl.saveXml(canvas, 2);
    }

    @GetMapping(value = "/load", params = "slot")
    public Canvas loadJson(@Param("slot") int slot) {
        return sl.LoadJson(slot);
    }

    @GetMapping(value = "/create", params= {"shape","id", "x","y","color","strokeWidth","text"})
    public Shape1 loadXml(@Param("shape") String shape,@Param("id") String id, @Param("x") double x, @Param("y") double y, @Param("color") String color, @Param("strokeWidth") double strokeWidth,@Param("text") String text) {
        System.out.println(x);
        return sl.create(shape,x,id,y,color,strokeWidth,text);
    }

    @GetMapping(value="/clone")
    public Shape1 cloneShape(@RequestBody Shape1 shape) {

        return sl.clone(shape);
    }


}
