const dynamicModules = require('vue-dynamic-modules')

async function regist({router}, module){
    if(module.router){
        module.router.forEach(v=>{
            router.addRoute(v)
        })
    }
}

export default ({router})=>{
  return Promise.all(dynamicModules).then((moduleInstances)=>{
    for(const curModule of moduleInstances){
      curModule.keys().forEach(key=>{
        const m = curModule(key).default
        if(m.moduleName){regist({router}, m)}
      })
    }
    return null
  })
}