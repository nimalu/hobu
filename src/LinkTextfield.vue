<template>
  <div class="bg-gray-50 transition duration-200 p-2 rounded-sm ring-1 ring-gray-200 focus-within:ring-pink-500 flex flex-col">
    <input
      :value="value"
      @input="$emit('update:value', $event.target.value)"
      placeholder="Name"
      class="value text-md bg-transparent focus:outline-none flex-grow"
    />
    <input
      :value="link"
      @input="$emit('update:link', $event.target.value)"
      placeholder="Link"
      class="link bg-transparent focus:outline-none"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    link: String
  },
};
</script>

<style scoped>
::placeholder {
  color: rgb(192, 192, 192)
}
.link {
  font-size: .7rem;
  color: rgb(90, 90, 90);
}
.value {
  font-weight: normal;
}
</style>
