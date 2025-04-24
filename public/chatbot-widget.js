/**
 * Embeddable Chatbot Widget
 * A lightweight, customizable chatbot that can be embedded in any website
 * with a single line of code.
 */
(function () {
  // Prevent multiple instances
  if (window.ChatbotWidgetLoaded) return;
  window.ChatbotWidgetLoaded = true;

  // Configuration (can be overridden via window.ChatbotConfig)
  const config = Object.assign(
    {
      apiEndpoint: "https://fmkt8f48q6.execute-api.ap-southeast-1.amazonaws.com/dev/bedrock-res",
      primaryColor: "#4a6cf7",
      title: "Chat Support",
      welcomeMessage: "Hi there! How can I help you today?",
      placeholderText: "Type your message here...",
      waitingPlaceholder: "Please wait...",
      position: "right", // 'right' or 'left'
      avatarBot: "🤖",
      avatarUser: "👤",
      apiHeaders: { "Content-Type": "application/json" },
      messageDelay: 300, // milliseconds delay for bot messages to appear
    },
    window.ChatbotConfig || {}
  );

  // Create and inject CSS
  const styles = document.createElement("style");
  styles.innerHTML = `
        .chatbot-widget {
            --primary-color: ${config.primaryColor};
            --shadow-color: rgba(0, 0, 0, 0.15);
            --bg-light: #ffffff;
            --text-dark: #333333;
            --text-light: #ffffff;
            --border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
            box-sizing: border-box;
            position: fixed;
            z-index: 9999;
            bottom: 20px;
            ${config.position}: 20px;
            margin: 0;
            padding: 0;
        }
        
        .chatbot-widget * {
            box-sizing: border-box;
        }
        
        /* Floating button */
        .chatbot-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: var(--text-light);
            box-shadow: 0 4px 12px var(--shadow-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .chatbot-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px var(--shadow-color);
        }
        
        .chatbot-button .close-icon {
            display: none;
            font-size: 20px;
        }
        
        .chatbot-button.open .chat-icon {
            display: none;
        }
        
        .chatbot-button.open .close-icon {
            display: block;
        }
        
        /* Chat container */
        .chatbot-container {
            position: absolute;
            bottom: 80px;
            ${config.position}: 0;
            width: 350px;
            height: 500px;
            background-color: var(--bg-light);
            border-radius: var(--border-radius);
            box-shadow: 0 5px 25px var(--shadow-color);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transform: translateY(20px) scale(0.95);
            transform-origin: bottom right;
            transition: all 0.3s ease;
        }
        
        .chatbot-container.open {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0) scale(1);
        }
        
        /* Chat header */
        .chatbot-header {
            background-color: var(--primary-color);
            color: var(--text-light);
            padding: 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        
        .chatbot-header .title {
            margin: 0;
            font-size: 16px;
        }
        
        /* Chat messages area */
        .chatbot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .chatbot-message {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 15px;
            margin-bottom: 5px;
            line-height: 1.4;
            font-size: 14px;
            position: relative;
            animation: fadeIn 0.3s ease;
            display: flex;
            gap: 8px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .chatbot-message .avatar {
            font-size: 24px;
            align-self: flex-start;
        }
        
        .chatbot-message .content {
            background: #f0f0f0;
            padding: 10px 12px;
            border-radius: 12px;
        }
        
        .chatbot-message.user {
            align-self: flex-end;
            flex-direction: row-reverse;
        }
        
        .chatbot-message.user .content {
            background-color: var(--primary-color);
            color: var(--text-light);
        }
        
        .chatbot-message.bot {
            align-self: flex-start;
        }
        
        /* Typing indicator */
        .typing-indicator {
            display: flex;
            padding: 10px 15px;
            align-self: flex-start;
        }
        
        .typing-indicator span {
            height: 8px;
            width: 8px;
            background-color: #bbb;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
            animation: bounce 1.3s linear infinite;
        }
        
        .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }
        
        /* Input area */
        .chatbot-input-container {
            padding: 10px 15px;
            border-top: 1px solid #eaeaea;
            display: flex;
        }
        
        .chatbot-input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .chatbot-input:focus {
            border-color: var(--primary-color);
        }
        
        .chatbot-input:disabled {
            background-color: #f5f5f5;
            color: #999;
            cursor: not-allowed;
        }
        
        .chatbot-send {
            width: 36px;
            height: 36px;
            margin-left: 10px;
            background-color: var(--primary-color);
            color: var(--text-light);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .chatbot-send:hover {
            transform: scale(1.05);
        }
        
        .chatbot-send:disabled {
            background-color: #cccccc;
            transform: none;
            cursor: not-allowed;
        }
        
        /* Responsive adjustments */
        @media (max-width: 480px) {
            .chatbot-container {
                width: calc(100vw - 40px);
                height: 60vh;
                bottom: 80px;
            }
        }
    `;
  document.head.appendChild(styles);

  // Create widget DOM elements
  function createChatbotElements() {
    // Main wrapper
    const widget = document.createElement("div");
    widget.className = "chatbot-widget";

    // Chat button
    const button = document.createElement("div");
    button.className = "chatbot-button";
    button.innerHTML = `
            <span class="chat-icon">💬</span>
            <span class="close-icon">✕</span>
        `;

    // Chat container
    const container = document.createElement("div");
    container.className = "chatbot-container";
    container.innerHTML = `
            <div class="chatbot-header">
                <h3 class="title">${config.title}</h3>
                <div class="chatbot-controls">
                    <span class="chatbot-minimize">–</span>
                </div>
            </div>
            <div class="chatbot-messages"></div>
            <div class="chatbot-input-container">
                <input type="text" class="chatbot-input" placeholder="${config.placeholderText}" aria-label="Chat message">
                <button class="chatbot-send" aria-label="Send message">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;

    // Append elements
    widget.appendChild(button);
    widget.appendChild(container);
    document.body.appendChild(widget);

    return {
      widget,
      button,
      container,
      messagesContainer: container.querySelector(".chatbot-messages"),
      input: container.querySelector(".chatbot-input"),
      sendButton: container.querySelector(".chatbot-send"),
      minimizeButton: container.querySelector(".chatbot-minimize"),
      header: container.querySelector(".chatbot-header"),
    };
  }

  // Initialize the chatbot functionality
  function initChatbot() {
    const elements = createChatbotElements();
    let isOpen = false;
    let isDragging = false;
    let isWaitingForResponse = false;
    let dragOffset = { x: 0, y: 0 };

    // Function to set input enabled/disabled state
    function setInputEnabled(enabled) {
      elements.input.disabled = !enabled;
      elements.sendButton.disabled = !enabled;

      if (enabled) {
        elements.input.placeholder = config.placeholderText;
      } else {
        elements.input.placeholder = config.waitingPlaceholder;
      }
    }

    // Toggle chatbot visibility
    function toggleChatbot() {
      isOpen = !isOpen;
      elements.container.classList.toggle("open", isOpen);
      elements.button.classList.toggle("open", isOpen);

      // Send welcome message if opening for the first time
      if (isOpen && elements.messagesContainer.children.length === 0) {
        addBotMessage(config.welcomeMessage);
      }

      // Focus input when opening (if not waiting for response)
      if (isOpen && !isWaitingForResponse) {
        setTimeout(() => elements.input.focus(), 300);
      }
    }

    // Add a bot message to the chat
    function addBotMessage(text) {
      const typingIndicator = document.createElement("div");
      typingIndicator.className = "typing-indicator";
      typingIndicator.innerHTML = "<span></span><span></span><span></span>";
      elements.messagesContainer.appendChild(typingIndicator);

      // Scroll to bottom
      scrollToBottom();

      // Show typing indicator for a moment
      setTimeout(() => {
        // Remove typing indicator
        elements.messagesContainer.removeChild(typingIndicator);

        // Add actual message
        const messageElement = document.createElement("div");
        messageElement.className = "chatbot-message bot";
        messageElement.innerHTML = `
                    <div class="avatar">${config.avatarBot}</div>
                    <div class="content">${text}</div>
                `;
        elements.messagesContainer.appendChild(messageElement);

        // Scroll to bottom again
        scrollToBottom();
      }, config.messageDelay);
    }

    // Add a user message to the chat
    function addUserMessage(text) {
      const messageElement = document.createElement("div");
      messageElement.className = "chatbot-message user";
      messageElement.innerHTML = `
                <div class="avatar">${config.avatarUser}</div>
                <div class="content">${text}</div>
            `;
      elements.messagesContainer.appendChild(messageElement);
      scrollToBottom();
    }

    // Scroll messages container to bottom
    function scrollToBottom() {
      elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    }

    // Get a cookie value by name
    function getCookieValue(name) {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split("=");
        if (cookieName === name) {
          return decodeURIComponent(cookieValue);
        }
      }
      return null;
    }

    // Send message to API and handle response
    async function sendMessage(message) {
      try {
        // Disable input while waiting for response
        isWaitingForResponse = true;
        setInputEnabled(false);

        // Get API key from cookies
        const apiKey = getCookieValue("chatbot_api_key");

        // Prepare headers
        const headers = {
          ...config.apiHeaders,
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        };

        const payload = {
          modelId: "amazon.titan-text-express-v1",
          inputText: message, // User's message
          inferenceParams: {
            temperature: 0.7,
            maxTokens: 500,
            topP: 0.9,
            stopSequences: [],
          },
        };

        // Add API key to headers if available
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`;
        }

        // Make API request
        const response = await fetch(config.apiEndpoint, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        return (
          data.reply ||
          data.response ||
          data.message ||
          data.body.completion ||
          "Sorry, I didn't understand that."
        );
      } catch (error) {
        console.error("Chatbot API error:", error);
        return "Sorry, I'm having trouble connecting to API right now.";
      } finally {
        // Re-enable input after response is received
        isWaitingForResponse = false;
        setInputEnabled(true);

        // Focus back on input field
        if (isOpen) {
          elements.input.focus();
        }
      }
    }

    // Handle sending a message
    async function handleSendMessage() {
      // Get message from input
      const message = elements.input.value.trim();
      if (!message || isWaitingForResponse) return;

      // Clear input
      elements.input.value = "";

      // Add user message
      addUserMessage(message);

      // Get and add bot response
      const response = await sendMessage(message);
      addBotMessage(response);
    }

    // Make the chat window draggable
    function initDraggable() {
      elements.header.addEventListener("mousedown", (e) => {
        isDragging = true;
        const rect = elements.container.getBoundingClientRect();
        dragOffset = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      });

      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        elements.container.style.left = `${x}px`;
        elements.container.style.top = `${y}px`;
        elements.container.style.bottom = "auto";
        elements.container.style.right = "auto";
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });
    }

    // Set up event listeners
    elements.button.addEventListener("click", toggleChatbot);
    elements.minimizeButton.addEventListener("click", toggleChatbot);
    elements.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !isWaitingForResponse) handleSendMessage();
    });
    elements.sendButton.addEventListener("click", () => {
      if (!isWaitingForResponse) handleSendMessage();
    });

    // Initialize draggable
    initDraggable();

    // Expose public API
    window.ChatbotWidget = {
      open: () => {
        if (!isOpen) toggleChatbot();
      },
      close: () => {
        if (isOpen) toggleChatbot();
      },
      toggle: toggleChatbot,
      sendMessage: (message) => {
        if (isWaitingForResponse) return; // Don't allow sending if already waiting

        if (!isOpen) toggleChatbot();
        elements.input.value = message;
        handleSendMessage();
      },
      isWaiting: () => isWaitingForResponse,
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();
