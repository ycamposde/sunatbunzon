const { Router } = require('express'); 
const router = Router();

const puppeteer = require('puppeteer');
const C = require('../constants');
// Fs nos servirá para crear nuestros archivos de resultados.
const fs = require("fs");

const CTA_SELECTOR = '#btnAceptar';

router.get('/', (req, res) => {
  async function run() {

    try {
      // const browser = await puppeteer.launch({
      //   headless: false
      // })
      const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox','--disable-setuid-sandbox']
      })
      
      const page = await browser.newPage()
      await page.goto("https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA==");
      
      await page.type('[id=txtRuc]', '20603343612');
      await page.type('[id=txtUsuario]', 'WENDOLIE');
      await page.type('[id=txtContrasena]', 'Darwin1');
      await page.click('#btnAceptar');
      
      
      // let reviews = []
      async function getPageData() {

        const cookies = await page.cookies();
        await page.setCookie(...cookies);
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await page.goto(`https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm?action=buzon&s=ww1`, {
          waitUntil: 'load',
          args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true,
          //remove the timeOut
          timeout: 0
        })
  
        const data = await page.evaluate(() => {
          
          let paginacion = document.querySelector('.cant-correo').textContent;

          let number_paginacion = 0;

          if (paginacion) {
            paginacion.split('de');
            if (paginacion.split('de') && paginacion.split('de').length > 0) {
              number_paginacion = Math.round(Number(paginacion.split('de')[1]) / 25);
            }
          }

          const buzon_notifiaciones = [];
          const buzon_mensajes = [];
          // if (number_paginacion > 0) {
            // for (var i = 0; i < number_paginacion; i++) {
              // if (i !== 0) {
              //   document.querySelector('#pager .pull-right .nextCorreo').click();
              // }

              const $reviews = document.querySelectorAll('.panel .list-group li');
              $reviews.forEach(($review) => {
                $review.querySelector('a').click();
                buzon_notifiaciones.push({
                  asunto: document.querySelector('.panel-body h4').textContent,
                  fecha_detalle: document.querySelector('.panel-body h5').textContent,
                  etiqueta: document.querySelector('.panel-body .clearfix').textContent.trim(),
                  detalle: document.querySelector('.panel-body .contenedor-correo iframe').src,
                })
              }) 
            // }
            document.querySelector('.panel #aListMen').click()
            // paginacion = document.querySelector('.cant-correo').textContent;
            // if (paginacion) {
            //   paginacion.split('de');
            //   if (paginacion.split('de') && paginacion.split('de').length > 0) {
            //     number_paginacion = Math.round(Number(paginacion.split('de')[1]) / 25);
            //   }
            // }
          // }

          // if (number_paginacion > 0) {
            // for (var i = 0; i < number_paginacion; i++) {
              // if (i !== 0) {
              //   document.querySelector('#pager .pull-right .nextCorreo').click();
              // }

              const $reviews_1 = document.querySelectorAll('.panel .list-group li');
              $reviews_1.forEach(($review_1) => {
                $review_1.querySelector('a').click();
                buzon_mensajes.push({
                  asunto: document.querySelector('.panel-body h4').textContent,
                  fecha_detalle: document.querySelector('.panel-body h5').textContent,
                  etiqueta: document.querySelector('.panel-body .clearfix').textContent.trim(),
                  // detalle: document.querySelector('.panel-body .contenedor-correo iframe').src,
                })
              }) 
            // }
          // }
        //document.querySelector('.panel #aListMen').click()
          return {
            buzon_notifiaciones,
            buzon_mensajes,
            number_paginacion
          }
        })
        console.log('data', data);
        // console.log('number_paginacion', number_paginacion);
        // fs.writeFile('data.js', data);
        res.json(data);
        // await browser.close()
      }
      getPageData()
    
    } catch (err) {
      console.error('salio error', err);
    }
  }
  
  run()
});

module.exports = router;