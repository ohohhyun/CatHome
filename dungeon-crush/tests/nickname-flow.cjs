// Existing gameplay scenarios now complete the real first-launch name form.
exports.completeNickname=async function(page,name='모험가'){
 if(await page.locator('#nickname-screen').isVisible()){
  await page.locator('#create-nickname').fill(name);
  await page.locator('#create-nickname-submit').click();
  await page.locator('#character-screen').waitFor({state:'visible'});
 }
};
