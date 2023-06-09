/**
 * @file routes.js
 * @description Define las rutas ante las que va a responder al MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

const express = require("express");
const router = express.Router();
const { callbacks } = require("./callbacks");



/**
 * Ruta raíz: /
 */
router.get("/", async (req, res) => {
    try {
        await callbacks.home(req, res)
    } catch (error) {
        console.log(error);
    }
});

/**
 * Ruta Acerca De (es decir, About...)
 */
router.get("/acercade", async (req, res) => {
    try {
        await callbacks.acercaDe(req, res)
    } catch (error) {
        console.log(error);
    }
});



/**
 * Test de conexión a la BBDD
 */
router.get("/test_db", async (req, res) => {
    try {
        await callbacks.test_db(req, res)
    } catch (error) {
        console.log(error);
    }
});

/**
 * Devuelve todas las personas(motociclistas) que hay en la BBDD
 */
router.get("/getTodos", async (req, res) => {
    try {
        await callbacks.getTodos(req, res)
    } catch (error) {
        console.log(error);
    }
});

/**
 * Devuelve todos los nombres (motociclistas) que hay en la BBDD
 */
router.get("/getNombres", async (req, res) => {
    try {
        await callbacks.getNombres(req, res)
    } catch (error) {
        console.log(error);
    }
});

/**
 * Devuelve todos los nombres (motociclistas) por orden alfabético que hay en la BBDD
 */
router.get("/getNAlfabeticamente", async (req, res) => {
    try {
        await callbacks.getNAlfabeticamente(req, res)
    } catch (error) {
        console.log(error);
    }
});



// Exporto el módulo para poder usarlo en server
module.exports = router;
