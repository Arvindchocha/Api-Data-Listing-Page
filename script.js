const section = document.getElementById('section');
const paginationUl = document.getElementById('paginationUl');
const loading = document.createElement("div");
loading.textContent = "LOading..."

let current_page = 1;
let records_per_page = 10;
let allData = [];


async function getData() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}


function displayData(data) {
    data.forEach((item) => {
        const div = document.createElement("div");
        div.innerHTML = `<h2>${item.title}</h2>
        <p>${item.body}</p>
        `
        section.appendChild(div);
    })
}


function pagination(allData) {
    paginationUl.innerHTML = "";
    const totalPages = Math.ceil(allData.length / records_per_page);
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.textContent = i;
        paginationUl.appendChild(li);
    }
    paginationUl.children[0].classList.add("active");
}

async function render() {
    section.appendChild(loading);
    try {
        allData = await getData();

        const startIndex = (current_page - 1) * records_per_page;
        const endIndex = startIndex + records_per_page;
        const pageData = allData.slice(startIndex,endIndex);
        displayData(pageData);
        pagination(allData);
    } catch (error) {
        console.error("Error fetching data", error);
        section.textContent = "Something went wrong 😢";
    } finally {
        loading.remove();
    }
}

render();