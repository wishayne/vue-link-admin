<template>
    <div>
        <c-sb></c-sb>
        <c-pd :scroll-num="scroll"></c-pd>
    </div>
</template>

<script>

    import Lib from '@/assets/lib.js'

    import cSb from "./c_searchbanner"
    import cPd from "./c_pdetail"

    export default {
        name: 'Home',
        components: {
            cSb,
            cPd
        },
        data() {
            return {
                //滚动量
                scroll: 0
            }
        },
        created() {
        },
        mounted() {
            //绑定方法
            window.addEventListener('scroll', this.throttle(this.windowScroll, 200));
        },
        methods: {
            windowScroll() {
                this.scroll = Lib.C.getScrollTop();
            }
        }
    }
</script>
