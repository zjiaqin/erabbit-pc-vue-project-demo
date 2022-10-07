import defaultImg from '@/assets/images/200.png'
// import XtxBreadItem from './xtx-bread-item.vue'
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// 批量导入组件
const importFn = require.context('./', false, /\.vue$/)
export default {
  install(app) {
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 批量注册组件
    importFn.keys().forEach((key) => {
      const component = importFn(key).default
      app.component(component.name, component)
    })

    // 导出定义指令
    defineDirective(app)
  }
}
// 指令
const defineDirective = (app) => {
  // 图片懒加载指令
  app.directive('lazyload', {
    mounted(el, binding) {
      const observer = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            observer.unobserve(el)
            el.onerror = () => {
              el.src = defaultImg
            }
            el.src = binding.value
          }
        },
        {
          threshold: 0.01
        }
      )
      observer.observe(el)
    }
  })
}
