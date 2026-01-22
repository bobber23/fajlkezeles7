document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

const getMethodFetch = (url) => {
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Hiba: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            throw new Error(`Hiba történt: ${error.message}`);
        });
};

const fetchData = async () => {
    try {
        const data = await getMethodFetch('http://127.0.0.1:3000/api/getvizsgazok');

        const elsoOszlop = document.getElementById('elsoOszlop');

        const select = document.createElement('select');
        select.setAttribute('id', 'vizsgazoSelect');
        select.setAttribute('class', 'form-control w-100 mt-2');
        const option = document.createElement('option');
        option.innerHTML = 'Még nincs kiválasztott vizsgázó';
        select.appendChild(option);

        data.vizsgazok.forEach((element) => {
            const option = document.createElement('option');
            option.innerHTML = element.Nev;
            select.appendChild(option);
        });

        elsoOszlop.replaceChildren(select);

        select.addEventListener('change', vizsgazoTablazat);
    } catch (error) {
        console.error('Hiba történt: ', error);
    }
};

const vizsgazoTablazat = async () => {
    try {
        const data = await getMethodFetch('http://127.0.0.1:3000/api/getvizsgazok');

        const elsoOszlop = document.getElementById('elsoOszlop');

        const select = document.getElementById('vizsgazoSelect');

        console.log(data.vizsgazok[select.selectedIndex - 1]);

        const tablazat = document.createElement('card');
        tablazat.setAttribute('class', 'list-group text-start list-group-item');
        const nev = document.createElement('h3');
        nev.innerHTML = data.vizsgazok[select.selectedIndex - 1].Nev;
        const sor1 = document.createElement('p');
        sor1.innerHTML =
            'Szovegszerkesztes: ' + data.vizsgazok[select.selectedIndex - 1].Szovegszerkesztes;
        const sor2 = document.createElement('p');
        sor2.innerHTML =
            'Adatbáziskezelés: ' + data.vizsgazok[select.selectedIndex - 1].Adatbaziskezeles;
        const sor3 = document.createElement('p');
        sor3.innerHTML = 'Programozás: ' + data.vizsgazok[select.selectedIndex - 1].Programozas;
        const sor4 = document.createElement('p');
        sor4.innerHTML = 'Szóbeli: ' + data.vizsgazok[select.selectedIndex - 1].Szobeli;

        tablazat.appendChild(nev);
        tablazat.appendChild(sor1);
        tablazat.appendChild(sor2);
        tablazat.appendChild(sor3);
        tablazat.appendChild(sor4);
        elsoOszlop.replaceChildren(select, tablazat);
    } catch (error) {
        console.error('Hiba történt: ', error);
    }
};
