import { ref } from "@vue/reactivity"
const defaultData = [
    {
        name: "Vorlesung 1",
        link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ%2Fcymo",
        links: [
            { name: "Ilias", link: "https://de.wikipedia.org/wiki/Weiler_(Schorndorf)" },
            { name: "Tutorium", link: "https://www.google.com/search?q=do+a+barrel+roll" },
            { name: "Skript", link: "https://youtu.be/0dwkbIfCU8g" }
        ],
    },
    {
        name: "Freizeit",
        link: "",
        links: [
            { name: "Lieblingsblog", link: "https://www.instagram.com/mpgumdiewelt/" },
            { name: "Wetter", link: "https://www.wetteronline.de/wetter/karlsruhe"}
        ],
    },
];

export default ref(defaultData)