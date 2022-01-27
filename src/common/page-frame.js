/**
 * 用法等同于iframe，显示内容为router.js中路由对应的组件
 */

import { strToParams } from '@/utils/route-handle.js'

export default {
    name: 'PageFrame',
    data() {
        return {
            query: null
        };
    },
    props: {
        src: {
            type: String,
            default: ''
        },
        types: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    computed: {
        getUrl() {
            return new URL(this.src);
        },
        getPath() {
            return this.getUrl.pathname || this.src;
        },
        getQuery() {
            const { search } = this.getUrl;
            return strToParams(search);
        },
        getAllRoutes() {
            const { routes } = this.$router.options;
            const allRoutes = [];
            routes.forEach((cv) => {
                const { children = [] } = cv;
                allRoutes.push(cv);
                allRoutes.push(...children);
            });
            return allRoutes;
        },
        getCurRoute() {
            const route = this.checkUrl(this.src);
            return route;
        }
    },
    created() {
        this.query = this.getWmQuery;
        this.initInterceptor();
        // this.$wm_page.setInteceptor((route)=>{
        //   let curRoute = this.checkUrl(route)
        //   if(curRoute){
        //     this.$emit('turn_to_page',route)
        //     return false
        //   }else{
        //     this.clear()
        //     return true
        //   }
        // })
    },
    beforeDestroy() {
        this.clear();
    },
    watch: {
        getCurRoute: {
            handler(val) {
                console.log(`WM Router match: `, val);
                if (!this.$wm_page.interceptor) {
                    this.initInterceptor();
                }
                if (this.src && !val) {
                    this.$wm_page.push(this.src);
                }
            },
            immediate: true
        },
        getQuery: {
            handler(val) {
                this.$store.commit('setInnerRouteQuery', val);
            },
            immediate: true
        }
    },
    render(createElement) {
        if (this.getCurRoute) {
            const { component } = this.getCurRoute;
            return createElement(component, { key: this.src });
        } else {
            return createElement('div');
        }
    },
    methods: {
        // 初始化路由拦截器
        initInterceptor() {
            this.$wm_page.setInteceptor((route) => {
                const curRoute = this.checkUrl(route);
                if (curRoute) {
                    this.$emit('turn_to_page', route);
                    return false;
                } else {
                    this.clear();
                    return true;
                }
            });
        },
        clear() {
            this.$store.commit('clearInnerRouteQuery');
            this.$wm_page.setInteceptor(null);
        },
        checkUrl(src) {
            if (!src) return;
            let path = '';
            if (typeof src == 'string') {
                try {
                    const urlObj = new URL(src);
                    path = urlObj.pathname;
                } catch (err) {
                    console.log(err);
                    path = src;
                }
            } else {
                path = src.path;
            }
            const route = this.getAllRoutes
                .filter((cv) => {
                    const { meta = {}} = cv;
                    const { route_type = '' } = meta;
                    return this.types.includes(route_type);
                })
                .find((cv) => cv.path == path);
            if (route) {
                return route;
            } else {
                return null;
            }
        }
    }
};
