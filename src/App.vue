<template>
  <div class="flex justify-between items-center w-4/5 mx-auto mt-12">
    <div>
      <h1 class="heading">HoBu</h1>
      <h3 class="subheading">Homepage Builder</h3>
    </div>
    <div class="flex flex-wrap">
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
  <div class="flex items-start w-4/5 mx-auto my-2">
    <editor class="w-7/12 flex flex-col items-center" />
    <div
      class="ml-2 w-5/12 shadow-sm bg-white border-gray-200 border p-3 px-4 mb-2 mx-auto rounded flex flex-col"
    >
      <strong>Step 1</strong>
      <p class="mb-2">
        If you've already setup a <em>HOBU page</em> you can continue working on
        it by uploading the generated config file.
      </p>

      <strong>Step 2</strong>
      <p>
        Modify the config on the left to suit your needs. Every section will be
        displayed as a card. Every element is clickable thus you have to provide
        a link.
      </p>
      <p class="mb-2">
        If you want to work on the config another time you can download it via
        the button above.
      </p>
      <div class="my-2">
        <preview :classes="cards" :background="backgroundLoaded" />
        <p class="text-gray-500">Preview</p>
      </div>

      <strong>Step 3</strong>
      <p class="mb-2">
        You can use a custom background image. Just choose one after clicking on
        the associated button above.
      </p>
      <strong>Step 4</strong>
      <p class="mb-2">
        Download the page and save it to a location that you can remember.
        Extract the content by right-clicking on the downloaded archive and
        choose <em>Extract all</em>
        (option possibly named different)
      </p>
      <p>
        Now it's time to configure your browser to use this page as a start
        page. In the following it'll be explained how to do it in
        <em>Firefox</em>. Open the extracted file <em>index.html</em> with
        firefox. Go to
        <img
          width="20"
          height="20"
          src="@/static/menubutton.png"
          class="inline"
        />
        <em>menu</em>,
        <img
          width="20"
          height="20"
          src="@/static/settings.jpg"
          class="inline"
        />
        settings,
        <img width="20" height="20" src="@/static/home.jpg" class="inline" />
        home. Then, click on <em>Use Current Page</em>. Voilà!
      </p>
    </div>
  </div>
</template>

<script>
import JSZip from "jszip";
import Mustache from "mustache";
import Editor from "./Editor.vue";
import cards from "@/data.ts";
import preview from "@/Preview";

const defaultBackground =
  "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

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
  components: { Editor, preview },
  name: "App",
  data() {
    return {
      cards,
      background: defaultBackground,
      backgroundLoaded: defaultBackground,
    };
  },
  methods: {
    downloadContent() {
      window._paq.push(['trackEvent', 'action', 'download_content']);
      downloadAs(
        "content.json",
        new Blob([JSON.stringify({ classes: cards.value }, null, 2)], {
          type: "application/json",
        })
      );
    },
    downloadZip() {
      window._paq.push(['trackEvent', 'action', 'download_zip']);
      const zip = new JSZip();
      zip.file(
        "index.html",
        Mustache.render(require("@/static/template.html").default, {
          classes: cards.value,
          bg: this.background?.name || defaultBackground,
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
      window._paq.push(['trackEvent', 'action', 'upload_background']);
      this.background = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backgroundLoaded = e.target.result;
      };
      reader.readAsDataURL(ev.target.files[0]);
    },
    loadTextFromFile(ev) {
      window._paq.push(['trackEvent', 'action', 'upload_config']);
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
  mounted() {
    window._paq.push(['trackPageView'])
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
  @apply border-2 mx-1 my-0.5 bg-gray-50 text-gray-800 hover:bg-gray-100 cursor-pointer active:bg-gray-300 font-semibold py-1 px-2 border text-black rounded-md shadow inline-flex items-center;
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
  margin-top: -0.8em;
  letter-spacing: 0.1em;
}
</style>
