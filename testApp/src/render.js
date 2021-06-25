let currentDatabase = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let entrySearchInput = document.getElementById('entrySearchInput');
entrySearchInput.addEventListener("keyup", async (event) => {

    const searchString = event.target.value.toLowerCase();
    const filteredEntries = currentDatabase.filter( entry => {
        return entry.nickname.toLowerCase().includes(searchString);
    })
    drawFilteredEntries(filteredEntries);
})

function garbageCollection() {
    // remove old data
    let entrySectionChildren = document.getElementById('entry-section').children;
    console.log("Numer of current children: ", entrySectionChildren.length);
    console.log("current children: ", entrySectionChildren);
    console.log("Going into loop!");
    
    for (let i = entrySectionChildren.length-1; i >= 0; i--) {
        console.log("current i: ", i);
        console.log("Numer of current children: ", entrySectionChildren.length);
        console.log("current children: ", entrySectionChildren);
        console.log("Removing item: ", entrySectionChildren[i]);
        entrySectionChildren[i].remove();
    }
}

async function drawFilteredEntries(object) {
    garbageCollection() ;

    object.forEach(async function (entry) {
        addEntry(entry);
    })

}

async function drawDatabaseEntries() {

    garbageCollection();

    let database = window.electron.getEntries();
    console.log("current database: ", database);
    console.log("drawDatabaseEntries is called!");

    // entries names
    let keys = Object.keys(database);

    // runs for amount of entries
    for (i = 0; i < keys.length;i++) {
        // pushes current database key to currentDatabase
        let entry = database[keys[i]];
        currentDatabase.push(entry);
        // adds entry to screen
        addEntry(entry);
    }

    console.log("=========================");
}

async function addNewEntry() {
    console.log("======================")

    /*debug  
        {
        id: "343423",
        icon: "fa-at",
        nickname: 'Test nickname',
        subtitle: 'Test subtitle',
        username: "Test username",
        link: "https://www.google.com",
        password: "123456789"
        }
    */

    // get info from modal

    const form = document.getElementById("newEntryModalForm");

    let newEntry = Object.values(form).reduce((obj,field) => { obj[field.name] = field.value; return obj }, {})

    newEntry.icon = "fa-at";

    // hash function -> makes unique ID
    newEntry.id = sha256(newEntry.nickname).toString();

    console.log("New Entry with hash: ", newEntry.id, " : " , newEntry);
    
    // store in backend database
    window.electron.storeEntry(newEntry.id , newEntry);
    console.log("New Entry added to backend database!")

    // redraw entries
    drawDatabaseEntries();

    // closes modal
    changeModalState(false);
    
}

function changeModalState(x) {
    let modal = document.getElementById("newEntryModal");
    if(x) {
        modal.classList.add("is-active");
    } else {
        modal.classList.remove("is-active");
    }

}

// add entries function
async function addEntry(contentObject) {
    console.log("Generating new Object!", contentObject.nickname)
    // create card
    let entrySection = document.getElementById("entry-section");
    
    let card = document.createElement("div");
        card.setAttribute("class", "card entry is-clickable has-icons-left mb-5");
        card.setAttribute("onclick", "openPasswordEntry(this)");
    entrySection.appendChild(card);

        let iconWrapper = document.createElement("div");
            iconWrapper.setAttribute("class", "card-content entry-icon is-flex is-align-items-center");
        card.appendChild(iconWrapper);

            let icon = document.createElement("div");
                icon.setAttribute("class", "icon is-large");
            iconWrapper.appendChild(icon);

                let actualIcon = document.createElement("i");
                    actualIcon.setAttribute("class", "fas fa-2x");
                    actualIcon.classList.add(contentObject.icon);
                icon.appendChild(actualIcon);

        let cardContent = document.createElement("div");
            cardContent.setAttribute("class", "card-content");
        card.appendChild(cardContent);

            let title = document.createElement("h3");
                title.setAttribute("class", "title");
                title.textContent = contentObject.nickname;
            cardContent.appendChild(title);

            let subtitle = document.createElement("p");
                subtitle.setAttribute("class", "subtitle");
                subtitle.textContent = contentObject.subtitle;
            cardContent.appendChild(subtitle);
}

function openPasswordEntry(e) {
    console.log(e);
}