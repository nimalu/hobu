<template>
  <div class="scroll-container">
    <section>
      <h1>HomeBuilder</h1>
      <p>
        Baue die Seite, die dein Internet Browser zu Beginn anzeigen soll. Fasse
        deine wichtigsten Lesezeichen zusammen, sodass du schnell und einfach
        auf sie zugreifen kannst.
      </p>
    </section>
    <section>
      <p>
        Du hast schon einmal eine solche Seite hier erstellt und möchtest diese
        nun bearbeiten? Dann kannst an dieser weiterarbeiten, indem du die
        Konfigurationsdatei hier auswählst.
      </p>
      <label class="file-select">
        <div class="button">
          <span>Config hochladen</span>
        </div>
        <input type="file" accept=".json" @change="loadTextFromFile" />
      </label>
      <p>Wenn nicht, scrolle einfach weiter nach unten.</p>
    </section>

    <section id="editor">
      <div class="row">
        <div v-for="(card, index) in cards" :key="card.index" class="card">
          <div class="card-left">
            <input v-model="card.name" class="property" placeholder="name" />
            <input v-model="card.link" class="property" placeholder="link" />
            <label class="delete" @click="cards.splice(index, 1)"
              ><span class="material-icons"> delete </span></label
            >
          </div>
          <div class="vertical-line" />
          <div class="card-right">
            <div
              v-for="(link, index) in card.links"
              :key="link.href"
              class="key-value-pair"
            >
              <input v-model="link.name" class="property" placeholder="name" />
              <input v-model="link.link" class="property" placeholder="link" />
              <label class="delete" @click="card.links.splice(index, 1)"
                ><span class="material-icons"> delete </span></label
              >
            </div>
            <label class="button add-button" @click="addLink(card)">
              <span class="material-icons"> add </span>
            </label>
          </div>
        </div>
        <label class="button add-button" @click="addCard">
          <span class="material-icons"> add </span>
        </label>
      </div>
    </section>
    <section>
      <p>
        Ohne Hintergrund sieht die Seite sehr langweilig aus. Suche dir deshalb
        einen schönen Hintergrund aus und wähle diesen hier aus.
      </p>
      <label class="file-select">
        <div class="button">
          <span>Hintergrund hochladen</span>
        </div>
        <input type="file" accept="image/*" @change="loadBackground" />
      </label>
    </section>

    <section>
      <p>
        Nun kannst du dir deine erstellte Seite herunterladen. Speichere diese zunächst an eine Stelle, die du dir merken kannst.
      </p>
      <!-- <a @click="downloadContent" class="button">Download Config</a> -->
      <a @click="createZip" class="button">Seite herunterladen</a>
    </section>

    <section>
      <p>
        Die eben heruntergeladene Datei musst du nun entpacken. Mache dazu einen Rechtsklick auf die Datei und wähle "Entpacken" oder "Extrahieren".
        Nun musst du noch deine Browser Einstellungen anpassen. 
      </p>
    </section>
  </div>
</template>

<script>
import JSZip from "jszip";
import Mustache from "mustache";
const defaultData = [
  {
    name: "Vorlesung 1",
    link: "hier allgemeinen link einfügen",
    links: [
      { name: "Ilias", link: "hier link einfügen" },
      { name: "zoom meeting", link: "Hier link zur Konferenz einfügen" },
    ],
  },
  {
    name: "Vorlesung 2",
    link: "",
    links: [
      { name: "Tutorium", link: "" }
    ],
  },
  {
    name: "Freizeit",
    link: "",
    links: [
      { name: "Lieblingsblog", link: "" },
      { name: "Nachrichten", link: "" },
    ],
  }
];

function downloadAs(name, data) {
  const fileUrl = window.URL.createObjectURL(data);
  const fileLink = document.createElement("a");
  fileLink.href = fileUrl;
  fileLink.download = name;
  document.body.appendChild(fileLink);
  fileLink.click();
  fileLink.remove();
}

export default {
  name: "App",
  data() {
    return {
      cards: defaultData,
      focussed: null,
      background: null,
    };
  },
  watch: {
    cards(old, newC) {
      console.log(newC);
    },
  },
  methods: {
    addLink(parent) {
      if (!parent.links) {
        parent.links = [];
      }
      parent.links.push({});
    },
    addCard() {
      this.cards.push({});
    },
    downloadContent() {
      downloadAs(
        "content.json",
        new Blob([JSON.stringify({ classes: this.cards }, null, 2)], {
          type: "application/json",
        })
      );
    },
    createZip() {
      const zip = new JSZip();
      zip.file(
        "index.html",
        Mustache.render(require("@/static/template.html").default, {
          classes: this.cards,
          bg: this.background?.name || "bg.jpg",
        })
      );
      zip.file(this.background?.name || "bg.jpg", this.background || "bg.jpg");
      zip.file(
        "content.json",
        encodeURIComponent(
          JSON.stringify(
            {
              classes: this.cards,
            },
            null,
            2
          )
        )
      );

      zip.generateAsync({ type: "blob" }).then(function (content) {
        downloadAs("page.zip", content);
      });
    },
    loadBackground(ev) {
      this.background = ev.target.files[0];
    },
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const newCards = [];
          const raw = JSON.parse(e.target.result);
          const classes = raw.classes;
          classes.forEach((c) => {
            if (!c.name || !c.link) {
              throw new Error("could not read file");
            }
            newCards.push({
              name: c.name,
              link: c.link,
            });
          });
          this.cards = newCards;
        } catch (error) {
          alert(error);
        }
      };
      reader.readAsText(file);
    },
  },
};
</script>

<style>
*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  background-color: #1c1c1c;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
}

h1 {
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 80px;
  font-weight: 300;
  line-height: 58px;
  padding-top: -20px;
  margin: 0;
}

p {
  margin: 0.4em;
  color: #fff;
  font-size: 1.4em;
  line-height: 1em;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  width: 21em;
}

.scroll-container {
  height: 98vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

section:not(#editor) {
  height: 98vh;
  display: flex;
  flex-direction: column;
}

section {
  scroll-snap-align: center;
  justify-content: center;
  align-items: center;
  margin: 0 8em;
  text-align: center;
}

.delete {
  padding: 0.5em 0.5em;
  text-decoration: none;
  color: #fff;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
}
.delete:hover {
  color: #a72d2d;
}
.button {
  font-weight: bold;
  display: inline-block;
  padding: 0.35em 1.2em;
  border: 0.1em solid #fff;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.2em;
  box-sizing: border-box;
  text-decoration: none;
  color: #fff;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
}
.button:hover {
  color: #a72d2d;
  border-color: #a72d2d;
}
@media all and (max-width: 30em) {
  .button {
    display: block;
    margin: 0.4em auto;
  }
}
.add-button {
  margin: 1em;
}

.card {
  display: flex;
  margin: 1em;
}

.vertical-line {
  width: 5px;
  background-color: #a72d2d;
}

.card-left {
  text-align: right;
  display: flex;
  flex-direction: column;
  width: 30%;
}

.card-left > .property {
  font-size: 1.3em;
}

.card-right {
  flex-grow: 2;
}

.key-value-pair {
  display: flex;
  text-align: center;
}

.property {
  font-family: inherit;
  font-size: inherit;
  margin: 0.2em 0.5em;
  padding: 10px;
  border: 0;
  border-bottom: 1px solid #eee;
  transition: 0.3s border-color;
  transition: 0.3s color;
  outline: none !important;
  color: rgba(255, 255, 255, 0.637);
  background-color: #00000000;
}
.property:focus {
  border-color: #a72d2d;
  transition: 0.3s border-color;
  color: #ffffff;
}
.property:hover:not(:focus) {
  border-color: #d18484;
  transition: 0.3s border-color;
}
.card-right .property:nth-last-child(2) {
  flex-grow: 2;
}

.file-select > input[type="file"] {
  display: none;
}
</style>
