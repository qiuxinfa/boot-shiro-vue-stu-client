// export的作用个人觉得是暴露一些接口,然后另外的页面可以用import调用它
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}
