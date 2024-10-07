export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  main() {
    const aiIconHtml = `<div id="ai-icon" style="position: absolute; z-index: 9999; cursor: pointer; display: none;">
                          <img src="https://i.ibb.co/j8xrc5y/magic-icons.png" width="24" />
                        </div>`;
    document.body.insertAdjacentHTML('beforeend', aiIconHtml);

    const aiIcon = document.getElementById('ai-icon')!;

    const dialogHtml = `
      <div id="ai-dialog" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: 120px; background: #F9FAFB;
      border: 1px solid #A4ACB9; border-radius: 15px; padding: 26px;color: #A4ACB9; box-shadow: 0 0 10px rgba(0,0,0,0.1); z-index: 10000;">
        
        <input id="ai-input" type="text" placeholder="Your prompt" style="width: 100%; border: 1px solid #A4ACB9; color: #A4ACB9; border-radius: 15px; padding: 8px; margin-bottom: 10px;">
        <div style="float: right;">
          <button style="border: 2px solid #666D80; font-size:22px; font-weight:500; padding:0px 12px; border-radius: 15px; display: none;" id="insert-btn">Insert</button>
          <button style="background: #3B82F6; color: #ffffff; font-size:22px; font-weight:500; padding:0px 12px; border-radius: 15px;" id="generate-btn">Generate</button>
        </div>
        <p id="ai-response" style="margin-top: 10px;"></p>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', dialogHtml);

    const aiDialog = document.getElementById('ai-dialog')!;
    const aiInput = document.getElementById('ai-input') as HTMLInputElement;
    const aiResponse = document.getElementById('ai-response')!;
    const insertButton = document.getElementById('insert-btn')!;
    const generateButton = document.getElementById('generate-btn')!;

    function positionAiIcon(inputField: Element) {
      const rect = inputField.getBoundingClientRect();
      aiIcon.style.top = `${rect.bottom - 30 + window.scrollY}px`;
      aiIcon.style.left = `${rect.right - 35 + window.scrollX}px`;
      aiIcon.style.zIndex = '99999';
    }

    let inputField: Element | null = null;

    function handleInputFocus() {
      if (inputField) {
        inputField.addEventListener('focus', () => {
          console.log('Input field is focused');
          if (inputField) {
            positionAiIcon(inputField);
          }
          aiIcon.style.display = 'block';
        });

        inputField.addEventListener('blur', () => {
          setTimeout(() => {
            if (!aiIcon.contains(document.activeElement)) {
              aiIcon.style.display = 'none';
            }
          }, 100);
        });
      }
    }

    const observer = new MutationObserver(() => {
      inputField = document.querySelector('div.msg-form__contenteditable[role="textbox"]');

      if (inputField) {
        handleInputFocus();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    aiIcon.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      console.log('AI Icon clicked!');

      if (inputField) {
        (inputField as HTMLElement).focus();
      }

      aiDialog.style.display = 'block';
    });

    generateButton.addEventListener('click', () => {
      const prompt = aiInput.value.trim();
      const generatedReply = `Reply thanking for the opportunity`; 
      aiResponse.innerText = generatedReply; 
      aiInput.value = generatedReply; 
      insertButton.style.display = 'inline-block';
      generateButton.innerText = 'Regenerate'; 
    });

    insertButton.addEventListener('click', () => {
      const replyText = 'Thank you for the opportunity! If you have any more questions or if there\'s anything else I can help you with, feel free to ask.';
      if (inputField) {
        inputField.innerHTML += `<p>${replyText}</p>`; 
      }
      aiDialog.style.display = 'none'; 
    });

    document.addEventListener('click', (event) => {
      const isClickInside = aiDialog.contains(event.target as Node);
      const isClickOnIcon = aiIcon.contains(event.target as Node);
      if (!isClickInside && !isClickOnIcon) {
        aiDialog.style.display = 'none';
      }
    });

    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'insertText') {
        const replyText = 'Thank you for the opportunity! If you have any more questions or if there\'s anything else I can help you with, feel free to ask.';
        if (inputField) {
          inputField.innerHTML += `<p>${replyText}</p>`;
        }
      }
    });
  },
});
