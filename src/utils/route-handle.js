import router from '../router';

// 获取所有路由信息（包括子路由）
const getAllRoutes = () => {
    const routes = router.options.routes;
    const routesMap = {};
    routes.forEach((cv) => {
        routesMap[cv.path] = 1;
        if (cv.children) {
            cv.children.forEach((ccv) => {
                const cPath = ccv.path.includes('/') ? ccv.path : `${cv.path}/${ccv.path}`;
                routesMap[cPath] = 1;
            });
        }
    });
    return routesMap;
}

// 路由参数，对象转为字符串
const objectToUrl = (object) => {
    const { path: pathname, hostname = location.hostname, protocol = location.protocol, query = {}} = object;
    const params = '?' + paramsToStr(query);
    return `${protocol}//${hostname}${pathname}${params}`;
}

// 路由参数，字符串转对象
const urlToObject = (url) => {
    let wm_url = url;
    [wm_url] = wm_url.split('//').reverse();
    const [pre_url, param_str] = wm_url.split('?');
    let [host, ...pathname] = pre_url.split('/');
    if (!host) {
        host = location.hostname;
    }
    const [hostname] = host.split(':');
    pathname = '/' + pathname.join('/');
    let query = {};
    if (param_str) {
        query = strToParams(param_str);
    }
    return {
        hostname,
        host,
        pathname,
        query
    };
}

const strToParams = (param_str) => {
    const params = {};
    const arr2 = param_str.split('&');
    for (let i = 0; i < arr2.length; i++) {
        const res = arr2[i].split('=');
        params[res[0]] = res[1];
    }
    return params;
}

function paramsToStr(params) {
    if (typeof params != 'object') return '';
    const keys = Object.keys(params);
    return keys.map((cv) => `${cv}=${params[cv]}`).join('&');
}

// function strToParams(param_str) {
//     const params = {};
//     const arr2 = param_str.split('&');
//     for (let i = 0; i < arr2.length; i++) {
//         const res = arr2[i].split('=');
//         params[res[0]] = res[1];
//     }
//     return params;
// }

export {
    getAllRoutes,
    objectToUrl,
    urlToObject,
    strToParams,
}



