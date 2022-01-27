// vue 3.0 响应式函数模拟

// 判断传入参数是否为对象
const isObject = val => val !== null && typeof val === 'object'
const convert = target => isObject(target) ? reactive(target) : target
// target中是否有属性key
const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key)

// 如果传入参数不是对象，直接返回
const reactive = function(target) {
    if (!isObject(target)) return target

    const handler = {
        get(target, key, receiver) {
            // 收集依赖
            const result = Reflect.get(target, key, receiver)
            // 访问对象如果也是对象，需要递归转换成响应式对象
            return convert(result)
        },
        // set方法中需要返回一个bool值，标识赋值是否成功
        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver)
            let result = true
            if (oldValue !== value) {
                result = Reflect.set(target, key, value, receiver)
                // 触发更新
                console.log('set', key, value)
            }
            return result
        },
        // 首先判断target中是否有key属性
        // 其次删除成功后需要触发更新
        // 最后返回删除是否成功
        deleteProperty(target, key) {
            const hadKey = hasOwn(target, key)
            const result = Reflect.deleteProperty(target, key)
            if (hadKey && result) {
                // 触发更新
                console.log('delete', key)
            }
            return result
        }
    }

    return new Proxy(target, handler)
};

export { reactive };
