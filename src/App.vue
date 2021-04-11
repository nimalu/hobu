<template>
  <div class="flex justify-between items-center w-4/5 mx-auto mt-12">
    <h1 class="heading">Startpage builder</h1>
    <div class="flex">
      <label class="file-select styled-button">
        <span class="material-icons mr-1"> file_upload </span>
        Config
        <input type="file" accept=".json" @change="loadTextFromFile" />
      </label>

      <label class="file-select styled-button">
        <span class="material-icons mr-1"> file_upload </span>
        Background
        <input type="file" accept="image/*" @change="loadBackground" />
      </label>

      <button class="styled-button" @click="downloadZip">
        <span class="material-icons mr-1"> file_download </span>
        Page
      </button>

      <button class="styled-button" @click="downloadContent">
        <span class="material-icons mr-1"> file_download </span>
        Config
      </button>
    </div>
  </div>
  <div class="flex items-start w-4/5 mx-auto my-6">
    <editor class="w-2/3 flex flex-col items-center" />
    <div
      class="ml-4 w-1/3 shadow-sm bg-white border-gray-200 border p-5 mb-2 mx-auto rounded flex flex-col"
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut suscipit
      ultricies tortor id bibendum. Class aptent taciti sociosqu ad litora
      torquent per conubia nostra, per inceptos himenaeos. Nulla aliquam turpis
      nec tempus congue. Etiam vehicula nisi vitae arcu dapibus ultrices.
      Maecenas maximus eget ligula at elementum. Etiam pellentesque faucibus
      dolor sed pellentesque. Mauris sodales mi urna, non dapibus nisl aliquam
      vitae. Quisque tincidunt augue in purus laoreet, sit amet ullamcorper eros
      tristique. Ut at interdum sem. Nullam ornare turpis in nisl convallis, ut
      vestibulum orci eleifend. Ut vulputate eros eget nibh sollicitudin
      porttitor. Sed commodo est tellus, ullamcorper porta lacus sodales et.
      Morbi eget purus pharetra urna pellentesque dignissim. Vestibulum ac massa
      ultricies, pellentesque odio vel, varius nisi. Maecenas vel tempor ligula.
      Phasellus non sodales tortor. Aenean at semper felis. Donec sagittis felis
      vestibulum diam dignissim ultricies. Nulla volutpat lobortis sem sit amet
      tempus. Praesent convallis tincidunt ornare. Donec rutrum sapien sit amet
      venenatis vulputate. Suspendisse eu tortor ac arcu tristique semper. Fusce
      nibh augue, hendrerit non massa sit amet, condimentum euismod nibh.
      Integer venenatis, eros eget mattis scelerisque, tellus elit volutpat
      libero, ut fringilla orci ligula quis tortor. Integer euismod ullamcorper
      augue, interdum blandit orci dapibus ac. Vestibulum risus erat, efficitur
      non arcu efficitur, laoreet egestas ligula. Nunc sed libero viverra,
      malesuada urna sed, tempus lacus. Ut ac ullamcorper turpis. Ut non
      suscipit nulla. Nunc fermentum mi fringilla lectus malesuada, in varius
      neque mollis. Aliquam posuere elementum est, tincidunt accumsan enim
      interdum vel. Cras in cursus nisi, sed auctor sem. Praesent eget efficitur
      neque. Donec pulvinar dapibus lorem, ut sodales massa luctus id. Nunc vel
      neque scelerisque augue pretium euismod at quis ipsum. Donec lacinia
      ligula odio, non vestibulum enim tristique ac. Nunc dignissim volutpat
      diam ut eleifend. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed tempus dapibus sem. Duis risus elit, egestas nec sollicitudin eget,
      rutrum ut turpis. Suspendisse vitae magna pulvinar, ullamcorper orci sit
      amet, ullamcorper ante. Nulla mollis magna quis laoreet bibendum. Fusce
      faucibus mattis dolor, ut cursus nunc. Nullam ac malesuada lacus.
      Pellentesque sed placerat ante, a condimentum mauris. Etiam faucibus
      turpis tellus, vel tincidunt sem tristique vitae. Morbi quis neque mi.
      Phasellus mi quam, imperdiet sit amet lorem vitae, vulputate lacinia
      lacus. Morbi faucibus fringilla risus, faucibus porta tortor blandit ac.
      Fusce euismod libero in sollicitudin bibendum. Etiam elit lectus, mattis
      in metus ut, luctus scelerisque dolor. Nullam elit nisl, posuere vitae
      porta sit amet, porta nec libero.
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
          bg: this.background?.name || "bg.jpg",
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
              links: c.links
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
  @apply ml-2 bg-pink-500 hover:bg-pink-600 cursor-pointer active:bg-pink-700 font-semibold py-2 px-4 border text-white rounded-md shadow flex items-center;
}
.heading {
  color: #111;
  font-family: "Open Sans Condensed", sans-serif;
  font-size: 3em;
  font-weight: 700;
  line-height: 64px;
  margin: 0 0 0;
  text-transform: uppercase;
}
</style>
