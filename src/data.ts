import { ref } from "@vue/reactivity"
const defaultData = [
    {
        name: "Vorlesung 1",
        links: [
            { name: "Ilias" },
            { name: "zoom meeting", link: "Hier link zur Konferenz einfügen" },
        ],
    },
    {
        name: "Vorlesung 2",
        link: "",
        links: [{ name: "Tutorium", link: "" }],
    },
    {
        name: "Freizeit",
        link: "",
        links: [
            { name: "Lieblingsblog", link: "" },
            { name: "Nachrichten", link: "" },
        ],
    },
];

export default ref(defaultData)