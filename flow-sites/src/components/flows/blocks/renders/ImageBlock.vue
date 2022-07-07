<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->
<template>
    <q-img :src="data.url" :ratio="data.ratio" :fit="data.fit"
        ><div
            v-if="data.captionText"
            :class="
                data.captionPosition +
                ' ' +
                data.fontSize +
                ' ' +
                data.fontStyle +
                ' ' +
                data.fontWeight
            "
            :style="'color:' + data.fontColor"
        >
            <fnt :face="data.font" :txtStr="data.captionText"></fnt></div
    ></q-img>
</template>

<script>
import { defineComponent } from "vue";

import Fnt from "../Font";

export default defineComponent({
    name: "ImageBlock",
    components: { Fnt },
    props: ["data", "dataCySlug"],
    setup(props) {
        console.log("ImageDisplay");
        console.log(props);

        return {};
    },
    methods: {},
});
</script>
