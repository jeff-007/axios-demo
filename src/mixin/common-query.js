export default {
    inject: {
        is_in_wm_frame: {
            default: false
        }
    },
    computed: {
        getRouteQuery() {
            return this.$route.query
        },
        getInnerRouteQuery() {
            return this.$store.getters.getInnerRouteQuery
        },
        getWmQuery() {
            let query = this.getRouteQuery
            if (this.is_in_wm_frame) {
                query = this.getInnerRouteQuery
                console.log('is inner')
            }
            console.log(query)
            return query
        }
        // // 全局数据 获取简化query data 重名参数会获取最后一位覆盖前面的
        // getWmQuery(){
        //   let option = { ...this.getRouteQuery, ...this.getInnerRouteQuery }
        //   for (let item in option) {
        //     if(Array.isArray(option[item])){
        //       option[item] = option[item][0] || ''
        //     }
        //   }
        //   return option
        // }
    }
}
