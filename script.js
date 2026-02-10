const section = document.getElementById('posts');
const paginationUl = document.getElementById('paginationUl');
const loading = document.createElement("div");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
loading.textContent = "Loading..."

let current_page = 1;
let records_per_page = 10;
let allData = [];
let dataFetched = false;


async function getData() {
    if (dataFetched) {
        return allData;
    }

    const res = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

function updateButtonStates() {
    const totalPages = Math.ceil(allData.length / records_per_page);
    prevBtn.disabled = current_page === 1;
    nextBtn.disabled = current_page === totalPages;
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
        if (i === current_page) {
            li.classList.add("active");
        }
        paginationUl.appendChild(li);
    }
}

function changePage() {
    const pageNumber = parseInt(this.textContent);
    if (pageNumber === current_page) return;
    section.innerHTML = "";
    current_page = pageNumber;
    render();
}

paginationUl.addEventListener("click", (e)=>{
    e.preventDefault();
    if(e.target.tagName === "LI"){
        changePage.call(e.target);
        paginationUl.querySelector(".active")?.classList.remove("active");
        e.target.classList.add("active");
    }
});
async function render() {
    section.innerHTML = "";
    section.appendChild(loading);
    try {
        allData = await getData();
        dataFetched = true;

        const startIndex = (current_page - 1) * records_per_page;
        const endIndex = startIndex + records_per_page;
        const pageData = allData.slice(startIndex, endIndex);
        
        displayData(pageData);
        pagination(allData);
        updateButtonStates();
    } catch (error) {
        console.error("Error fetching data", error);
        section.textContent = "Something went wrong 😢";
    } finally {
        loading.remove();
    }
}

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(allData.length / records_per_page);
    if (current_page < totalPages) {
        current_page++;
        section.innerHTML = "";
        render();
    }
});

prevBtn.addEventListener("click", () => {
    if (current_page > 1) {
        current_page--;
        section.innerHTML = "";
        render();
    }
});

render();