<template>
  <div class="flex justify-between items-center w-4/5 mx-auto mt-12">
    <div>
      <h1 class="heading">HoBu</h1>
      <h3 class="subheading">Homepage Builder</h3>
    </div>
    <div class="flex">
      <label class="file-select styled-button">
        <span class="material-icons mr-1"> file_upload </span>
        Config
        <input type="file" accept=".json" @change="loadTextFromFile" />
      </label>
      <button class="styled-button" @click="downloadContent">
        <span class="material-icons mr-1"> file_download </span>
        Config
      </button>

      <label class="file-select styled-button">
        <span class="material-icons mr-1"> file_upload </span>
        Background
        <input type="file" accept="image/*" @change="loadBackground" />
      </label>

      <button class="styled-button" @click="downloadZip">
        <span class="material-icons mr-1"> file_download </span>
        Page
      </button>
    </div>
  </div>
  <div class="flex items-start w-4/5 mx-auto my-6">
    <editor class="w-2/3 flex flex-col items-center" />
    <div
      class="ml-4 w-1/3 shadow-sm bg-white border-gray-200 border p-3 px-4 mb-2 mx-auto rounded flex flex-col"
    >
      <strong>Step 1</strong>
      <p class="mb-2">
        If you've already setup a <em>HOBU page</em> you can continue working on it by uploading the config file.
      </p>
      <strong>Step 2</strong>
      <img src="@/static/demo.jpg" class="my-2">
      <p class="mb-2">Schwapdidu hallo hallo</p>
      <strong>Step 3</strong>
      <p class="mb-2">Schwapdidu hallo hallo</p>
      <strong>Step 4</strong>
      <p class="mb-2">Schwapdidu hallo hallo</p>
    </div>
  </div>
</template>

<script>
import JSZip from "jszip";
import Mustache from "mustache";
import Editor from "./Editor.vue";
import cards from "@/data.ts";

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
  components: { Editor },
  name: "App",
  methods: {
    downloadContent() {
      downloadAs(
        "content.json",
        new Blob([JSON.stringify({ classes: cards.value }, null, 2)], {
          type: "application/json",
        })
      );
    },
    downloadZip() {
      const zip = new JSZip();
      zip.file(
        "index.html",
        Mustache.render(require("@/static/template.html").default, {
          classes: cards.value,
          bg: this.background?.name || "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        })
      );
      zip.file(this.background?.name || "bg.jpg", this.background || "bg.jpg");
      zip.file(
        "content.json",
        encodeURIComponent(
          JSON.stringify(
            {
              classes: cards.value,
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
            newCards.push({
              name: c.name,
              link: c.link,
              links: c.links,
            });
          });
          cards.value = newCards;
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
body {
  @apply bg-gray-200;
}
.file-select > input[type="file"] {
  display: none;
}
.styled-button {
  @apply border-2 border-pink-500 ml-2 bg-pink-500 hover:bg-pink-600 cursor-pointer active:bg-pink-700 font-semibold py-2 px-4 border text-white rounded-md shadow flex items-center;
}
.heading {
  color: #111;
  font-family: "Open Sans Condensed", sans-serif;
  font-size: 3em;
  font-weight: 700;
  text-transform: uppercase;
}
.subheading {
  color: #111;
  font-family: "Open Sans Condensed", sans-serif;
  font-size: 1em;
  font-weight: 300;
  text-transform: uppercase;
  margin-top: -.5em;
  letter-spacing: .1em;
}
</style>
