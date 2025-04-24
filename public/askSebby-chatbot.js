/**
 * AskSebby Chatbot Widget
 * Production-grade chatbot that can be embedded into any website with just one line
 */
(function () {
  // Prevent multiple instances
  if (window.AskSebbyLoaded) return;
  window.AskSebbyLoaded = true;

  // Configuration
  const config = {
    botName: "AskSebby",
    primaryColor: "#007bff",
    welcomeMessage: "Hey there! I'm AskSebby. How can I help you today?",
    apiEndpoint:
      "https://bedrock-runtime.YOUR_REGION.amazonaws.com/model/anthropic.claude-v2/invoke",
    position: "right", // 'right' or 'left'
    awsAccessKey: "YOUR_AWS_ACCESS_KEY",
    awsSecretKey: "YOUR_AWS_SECRET_KEY",
    awsRegion: "YOUR_REGION",
    modelId: "anthropic.claude-v2",
  };

  // Create CSS Styles
  const styles = document.createElement("style");
  styles.innerHTML = `
        /* AskSebby Chatbot Styles */
        #askSebby-widget {
            --primary: ${config.primaryColor};
            --shadow: rgba(0, 0, 0, 0.2);
            --text-light: #ffffff;
            --text-dark: #333333;
            --background: #ffffff;
            --border: #e0e0e0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            z-index: 999999;
        }

        #askSebby-button {
            position: fixed;
            bottom: 20px;
            ${config.position}: 20px;
            background-color: var(--primary);
            color: var(--text-light);
            border: none;
            border-radius: 50px;
            padding: 15px 20px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 12px var(--shadow);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            z-index: 999999;
        }

        #askSebby-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px var(--shadow);
        }

        #askSebby-button .icon {
            font-size: 20px;
        }

        #askSebby-button .close-icon {
            display: none;
        }

        #askSebby-button.open .chat-icon {
            display: none;
        }

        #askSebby-button.open .close-icon {
            display: inline;
        }

        #askSebby-container {
            position: fixed;
            bottom: 90px;
            ${config.position}: 20px;
            width: 350px;
            height: 500px;
            background-color: var(--background);
            border-radius: 16px;
            box-shadow: 0 6px 24px var(--shadow);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.9) translateY(20px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 999998;
        }

        #askSebby-container.open {
            transform: scale(1) translateY(0);
            opacity: 1;
            pointer-events: all;
        }

        #askSebby-header {
            background-color: var(--primary);
            color: var(--text-light);
            padding: 15px 20px;
            font-weight: bold;
            font-size: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        #askSebby-header .close-btn {
            background: none;
            border: none;
            color: var(--text-light);
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        #askSebby-header .close-btn:hover {
            opacity: 1;
        }

        #askSebby-messages {
            padding: 15px;
            height: calc(100% - 130px);
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            scroll-behavior: smooth;
        }

        .askSebby-message {
            max-width: 80%;
            padding: 12px 15px;
            border-radius: 18px;
            line-height: 1.4;
            font-size: 15px;
            position: relative;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .askSebby-message.bot {
            align-self: flex-start;
            background-color: #f1f1f1;
            color: var(--text-dark);
            border-bottom-left-radius: 5px;
        }

        .askSebby-message.user {
            align-self: flex-end;
            background-color: var(--primary);
            color: var(--text-light);
            border-bottom-right-radius: 5px;
        }

        .typing-indicator {
            display: flex;
            align-items: center;
            align-self: flex-start;
            background-color: #f1f1f1;
            border-radius: 18px;
            padding: 12px 15px;
        }

        .typing-indicator span {
            height: 8px;
            width: 8px;
            background: #888;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
            animation: bounce 1.3s linear infinite;
        }

        .typing-indicator span:nth-child(2) {
            animation-delay: 0.15s;
        }

        .typing-indicator span:nth-child(3) {
            animation-delay: 0.3s;
        }

        @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }

        #askSebby-input-container {
            display: flex;
            padding: 15px;
            border-top: 1px solid var(--border);
            background-color: var(--background);
            gap: 8px;
        }

        #askSebby-input {
            flex-grow: 1;
            padding: 12px 15px;
            border: 1px solid var(--border);
            border-radius: 24px;
            background-color: #f9f9f9;
            outline: none;
            font-size: 15px;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        #askSebby-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.2);
        }

        #askSebby-send {
            background-color: var(--primary);
            color: var(--text-light);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s, background-color 0.2s;
            flex-shrink: 0;
        }

        #askSebby-send:hover {
            transform: scale(1.05);
            background-color: #0069d9;
        }

        #askSebby-send svg {
            width: 18px;
            height: 18px;
        }

        /* Responsiveness */
        @media (max-width: 480px) {
            #askSebby-container {
                width: calc(100% - 40px);
                bottom: 80px;
            }
        }
    `;

  document.head.appendChild(styles);

  // Create DOM Elements
  function createChatbotElements() {
    // Main wrapper
    const widget = document.createElement("div");
    widget.id = "askSebby-widget";

    // Chat button
    const button = document.createElement("button");
    button.id = "askSebby-button";
    button.innerHTML = `
            <span class="icon chat-icon">💬</span>
            <span class="icon close-icon">✕</span>
            <span class="text">Chat</span>
        `;

    // Chat container
    const container = document.createElement("div");
    container.id = "askSebby-container";
    container.innerHTML = `
            <div id="askSebby-header">
                <div>${config.botName}</div>
                <button class="close-btn" aria-label="Minimize chat">−</button>
            </div>
            <div id="askSebby-messages"></div>
            <div id="askSebby-input-container">
                <input type="text" id="askSebby-input" placeholder="Type your message here..." aria-label="Chat message">
                <button id="askSebby-send" aria-label="Send message">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;

    // Append elements to DOM
    document.body.appendChild(widget);
    widget.appendChild(button);
    widget.appendChild(container);

    return {
      widget,
      button,
      container,
      messagesContainer: container.querySelector("#askSebby-messages"),
      input: container.querySelector("#askSebby-input"),
      sendButton: container.querySelector("#askSebby-send"),
      closeButton: container.querySelector(".close-btn"),
    };
  }

  // Initialize chatbot
  function initChatbot() {
    const elements = createChatbotElements();
    let isOpen = false;

    // Toggle chatbot visibility
    function toggleChatbot() {
      isOpen = !isOpen;
      elements.container.classList.toggle("open", isOpen);
      elements.button.classList.toggle("open", isOpen);

      // Send welcome message if opening for the first time
      if (isOpen && elements.messagesContainer.children.length === 0) {
        addBotMessage(config.welcomeMessage);
      }

      // Focus input when opening
      if (isOpen) {
        setTimeout(() => elements.input.focus(), 300);
      }
    }

    // Add a message from the bot
    function addBotMessage(text) {
      // Show typing indicator
      const typingIndicator = document.createElement("div");
      typingIndicator.className = "typing-indicator";
      typingIndicator.innerHTML = "<span></span><span></span><span></span>";
      elements.messagesContainer.appendChild(typingIndicator);

      // Scroll to bottom
      elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;

      // Show typing effect then actual message
      setTimeout(() => {
        // Remove typing indicator
        elements.messagesContainer.removeChild(typingIndicator);

        // Add message
        const messageElement = document.createElement("div");
        messageElement.className = "askSebby-message bot";
        messageElement.textContent = text;
        elements.messagesContainer.appendChild(messageElement);

        // Scroll to bottom
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
      }, 1000);
    }

    // Add a message from the user
    function addUserMessage(text) {
      const messageElement = document.createElement("div");
      messageElement.className = "askSebby-message user";
      messageElement.textContent = text;
      elements.messagesContainer.appendChild(messageElement);
      elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    }

    // Send message to AWS Bedrock API
    async function sendMessageToBedrock(message) {
      try {
        // In a real implementation, you should use proper AWS signature generation
        // This is a simplified example
        const response = await fetch(config.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Amz-Date": new Date().toISOString(),
            Authorization: `AWS4-HMAC-SHA256 Credential=${config.awsAccessKey}/${getDate()}/${
              config.awsRegion
            }/bedrock/aws4_request`,
            // In a real implementation, add proper AWS SigV4 signature headers
          },
          body: JSON.stringify({
            modelId: config.modelId,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
              prompt: `\n\nHuman: ${message}\n\nAssistant:`,
              max_tokens_to_sample: 300,
              temperature: 0.7,
              top_k: 250,
              top_p: 1,
            }),
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // Extract response based on Claude's output format
        return data.body.completion || "I'm having trouble processing that.";
      } catch (error) {
        console.error("Error calling AWS Bedrock:", error);
        return "I'm having technical difficulties right now. Please try again later.";
      }
    }

    // Simple date helper for AWS auth (YYYYMMDD format)
    function getDate() {
      const date = new Date();
      return date.toISOString().split("T")[0].replace(/-/g, "");
    }

    // Handle sending a message
    async function handleSendMessage() {
      const message = elements.input.value.trim();
      if (!message) return;

      // Clear input
      elements.input.value = "";

      // Add user message
      addUserMessage(message);

      // Get bot response
      const response = await sendMessageToBedrock(message);
      addBotMessage(response);
    }

    // Set up event listeners
    elements.button.addEventListener("click", toggleChatbot);
    elements.closeButton.addEventListener("click", toggleChatbot);
    elements.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });
    elements.sendButton.addEventListener("click", handleSendMessage);

    // Expose public API
    window.AskSebby = {
      open: () => {
        if (!isOpen) toggleChatbot();
      },
      close: () => {
        if (isOpen) toggleChatbot();
      },
      toggle: toggleChatbot,
      sendMessage: (message) => {
        if (!isOpen) toggleChatbot();
        setTimeout(() => {
          elements.input.value = message;
          handleSendMessage();
        }, 300);
      },
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();
