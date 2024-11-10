//此文件是注入到所有页面中的脚本
//@ts-check
;(() => {
  /**@type {{url:string,event:string,base_url:string}} */
  // @ts-expect-error
  const { url, event, base_url } = __nxInject_meta_json__
  console.log('inject.js', { url, event, base_url })

  if (!event.match(/^PageLoadEvent::Started$/)) return

  // 对非tauri页面添加返回按钮
  if (!url.match(/^(tauri:|ipc:|file:|https?:\/\/(\w+\.)*localhost)/)) {
    setInterval(() => {
      const buttonId = '__nx_backButton__'
      if (document.getElementById(buttonId)) return
      const backButton = document.createElement('button')
      backButton.id = buttonId
      backButton.innerText = '返回'
      backButton.style.position = 'fixed'
      backButton.style.left = '10px'
      backButton.style.top = '10px'
      backButton.style.zIndex = '9999'
      backButton.onclick = () => (location.href = base_url)
      document.body.appendChild(backButton)
    }, 200)
  }
})()
