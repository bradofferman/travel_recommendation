const options = { timeZone: 'America/Los_Angeles', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
const pstTime = new Date().toLocaleTimeString('en-US', options);
console.log("Current time in LA/Pacific:", pstTime);

const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');
const search = document.getElementById("search");
const resultDiv = document.getElementById("result");


search.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getDest(search.value);
    }
});

btnSearch.addEventListener('click', function() {
    getDest(search.value);
});

btnReset.addEventListener('click', function() {
    search.value = "";
    resultDiv.innerText = "";
});

function getDest(dest) {
    dest=dest.toLowerCase();
    if (dest == "country") {
        dest="countries";
    }
    let ans = "";

    fetch('./assets/travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            if (dest == "countries") {
                ans=[];
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        ans.push(city);
                    });
                });
            } 
            else {
                for(let item in data){
                    //console.log("item of ",item);
                    if(item.toLowerCase().includes(dest)) {
                        ans = data[item];
                    }
                }
            }

            if(!ans){
                data.countries.forEach(country => {
                    if(country.name.toLowerCase().includes(dest)){
                        ans = country.cities;
                    }
                });
            }

            display(ans);
            return ans;
        });
}

function display(data){
    resultDiv.innerHTML = '';
    data.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('search-result');
        div.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <button class="btnVisit">Visit</button>
        `;
        resultDiv.appendChild(div);
    });
}