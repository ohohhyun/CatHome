// Exercise the same collapsible dock and full menu that players use.
exports.expand=async page=>{if(await page.locator('#town-dock-toggle').getAttribute('aria-expanded')!=='true')await page.locator('#town-dock-toggle').click();};
exports.shortcut=async(page,key)=>{await exports.expand(page);await page.locator('#town-shortcuts [data-shortcut='+key+']').click();};
exports.tile=async(page,key)=>{await exports.shortcut(page,'menu');await page.locator('#quick-menu-grid [data-shortcut='+key+']').click();};
exports.lan=async page=>{await exports.tile(page,'lan');await page.locator('[data-content=story]').click();await page.locator('#stage-start').click();};
