<template>
  <div class="parent">
    <div
      class="fakebody"
      :style="`background-image: url('${background}');background-size: cover;`"
    >
      <div class="container">
        <div class="card" v-for="clazz in classes" :key="clazz.name">
          <h2>
            <a target="_blank" :href="clazz.link">{{ clazz.name }}</a>
          </h2>
          <hr />
          <template v-for="link in clazz.links" :key="link.name">
            <a class="small-text" target="_blank" :href="link.link">{{ link.name }}</a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["classes", "background"],
};
</script>


<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
  box-sizing: border-box;
  color: #000;
  text-decoration: none;
  transition-duration: 0.3s;
  padding: 0;
  margin: 0;
}

.parent {
  transform-origin: 0 0;
}

.fakebody {
  padding-top: .8em;
  padding-bottom: .8em;
}

.container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.card {
  min-width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  padding: .3em;
  margin: .2em;
  text-align: center;
  background-color: #fff;
}

.card:hover {
  background-color: #f1f1f1;
}

.card h2 {
  font-size: 16px;
  font-weight: bold;
}

.small-text {
  font-size: 9px;
}

.card hr {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  width: 90%;
  height: 1px;
  color: lavender;
}

.card a:not(:last-child) {
  margin-bottom: 0.1em;
}

.card a:hover {
  color: gray;
}
</style>