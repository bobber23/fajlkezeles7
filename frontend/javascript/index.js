document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    vizsgazoTablazat();
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
        const option = document.createElement('option');
        option.innerHTML = 'Még nincs kiválasztott vizsgázó';
        select.appendChild(option);

        data.vizsgazok.forEach((element) => {
            const option = document.createElement('option');
            option.innerHTML = element.Nev;
            select.appendChild(option);
        });

        elsoOszlop.replaceChildren(select);
    } catch (error) {
        console.error('Hiba történt: ', error);
    }
};

const vizsgazoTablazat = async () => {
    try {
        const data = await getMethodFetch('http://127.0.0.1:3000/api/getvizsgazok');

        const elsoOszlop = document.getElementById('elsoOszlop');

        const select = document.createElement('select');
        const option = document.createElement('option');
        option.innerHTML = 'Még nincs kiválasztott vizsgázó';
        select.appendChild(option);

        data.vizsgazok.forEach((element) => {
            const option = document.createElement('option');
            option.innerHTML = element.Nev;
            select.appendChild(option);
        });

        elsoOszlop.replaceChildren(select);
    } catch (error) {
        console.error('Hiba történt: ', error);
    }
};
