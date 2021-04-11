<template>
  <div class="flex items-start w-4/5 mx-auto my-8">
    <editor class="w-2/3 flex flex-col items-center" />
    <div
      class="ml-4 w-1/3 shadow-sm bg-white border-gray-200 border p-5 mb-2 mx-auto rounded flex flex-col"
    >
      <button
        class="w-60 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 font-semibold py-2 px-4 border text-white rounded-sm shadow"
      >
        Hintergrundbild hochladen
      </button>
      <button
        class="bg-pink-500 hover:bg-pink-600 active:bg-pink-700 font-semibold py-2 px-4 border text-white rounded-sm shadow"
      >
        Download
      </button>
    </div>
  </div>
</template>

<script>
import JSZip from "jszip";
import Mustache from "mustache";
import Editor from "./Editor.vue";

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
body {
  @apply bg-gray-200;
}
.file-select > input[type="file"] {
  display: none;
}
</style>
