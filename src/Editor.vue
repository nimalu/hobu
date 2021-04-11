<template>
  <div>
    <div
      v-for="(card, index) in cards"
      :key="card.index"
      class="w-full shadow-sm bg-white border-gray-200 border p-5 mb-2 rounded flex flex-col"
    >
      <div class="flex items-start justify-between">
        <textfield
          v-model:value="card.name"
          v-model:link="card.link"
          class="mb-4 bold-name flex-grow"
        />
        <button
          class="text-gray-200 hover:text-gray-500 focus:outline-none -mt-1 ml-3 -mr-1"
          @click="cards.splice(index, 1)"
        >
          <span class="material-icons"> close </span>
        </button>
      </div>
      <div
        v-for="(link, index) in card.links"
        :key="link.href"
        class="inline-flex items-center justify-between"
      >
        <button class="focus:outline-none">
          <span
            class="cursor-pointer text-gray-200 mr-2 ml-1 items-center justify-center hover:text-gray-500 material-icons"
            @click="card.links.splice(index, 1)"
          >
            remove
          </span>
        </button>

        <textfield
          v-model:value="link.name"
          v-model:link="link.link"
          class="mb-1 flex-grow"
        />
      </div>
      <div class="inline-flex items-center mt-4">
        <button class="focus:outline-none">
          <span
            class="cursor-pointer text-gray-200 mr-2 ml-1 items-center justify-center hover:text-gray-500 material-icons"
            @click="addLink(card)"
          >
            add
          </span>
        </button>
      </div>
    </div>
    <button
      class="bg-white border-gray-200 border w-10 flex p-1 mx-auto text-gray-200 items-center justify-center hover:text-gray-500 material-icons focus:outline-none"
      @click="addCard"
    >
      <span class="material-icons"> add </span>
    </button>
  </div>
</template>

<script>
import Textfield from "@/components/LinkTextfield";
import cards from "@/data.ts";

export default {
  components: { Textfield },
  setup() {
    function addLink(parent) {
      if (!parent.links) {
        parent.links = [];
      }
      parent.links.push({});
    }
    function addCard() {
      cards.value.push({});
    }
    return { addLink, addCard, cards };
  },
};
</script>

<style scoped>
.bold-name ::v-deep(.value) {
  font-weight: bold;
}
</style>