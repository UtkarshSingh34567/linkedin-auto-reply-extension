export default defineBackground(() => {
  console.log('Hello background!', { id: chrome.runtime.id }); 
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPopup') {
      chrome.action.openPopup(); 
    }
  });
});
