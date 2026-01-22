const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');
const { console } = require('inspector');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

const readJsonFile = async (filePath) => {
    try {
        const raw = await fs.readFile(filePath, 'utf8');
        return JSON.parse(raw); // JS objektum/tömb
    } catch (error) {
        throw new Error(`Olvasási hiba (json): ${error.message}`);
    }
};

//? /api/getvizsgazok
router.get('/getvizsgazok', async (request, response) => {
    try {
        const data = await readJsonFile(path.join(__dirname, '../files/erettsegi.json'));
        response.status(200).json({ vizsgazok: data });
    } catch (error) {
        console.log('GET /api/getvizsgazok error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

//? /api/getosztalyzatok
router.get('/getosztalyzatok', async (request, response) => {
    try {
        const data = await readJsonFile(path.join(__dirname, '../files/erettsegi.json'));

        const eredmenyek = data.map((vizsgazo) => {
            const irasbeliPont =
                vizsgazo.Szovegszerkesztes + vizsgazo.Adatbaziskezeles + vizsgazo.Programozas;
            const szobeliPont = vizsgazo.Szobeli;
            const osszpont = irasbeliPont + szobeliPont;

            const irasbeliSzazalek = Math.round((irasbeliPont / 120) * 100);
            const szobeliSzazalek = Math.round((szobeliPont / 30) * 100);
            const osszSzazalek = Math.round((osszpont / 150) * 100);

            let osztalyzat = 1;
            if (irasbeliSzazalek >= 12 && szobeliSzazalek >= 12) {
                if (osszSzazalek >= 60) {
                    osztalyzat = 5;
                } else if (osszSzazalek >= 47) {
                    osztalyzat = 4;
                } else if (osszSzazalek >= 33) {
                    osztalyzat = 3;
                } else if (osszSzazalek >= 25) {
                    osztalyzat = 2;
                }
            }

            return {
                Nev: vizsgazo.Nev,
                Osszpont: osszpont,
                Irasbeli_Szazalek: irasbeliSzazalek,
                Szobeli_Szazalek: szobeliSzazalek,
                Osztalyzat: osztalyzat
            };
        });

        response.status(200).json({ eredmenyek });
    } catch (error) {
        console.log('GET /api/getosztalyzatok error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
