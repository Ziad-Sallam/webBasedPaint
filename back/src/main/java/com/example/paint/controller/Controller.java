package com.example.paint.controller;


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

    @PostMapping(value = "/")
    public void save(@RequestBody Canvas canvas) {
        sl.saveJson(canvas, 2);
        sl.saveXml(canvas, 2);
    }

    @GetMapping(value = "/", params = "slot")
    public Canvas loadJson(@Param("slot") int slot) {
        return sl.LoadJson(slot);
    }
}
