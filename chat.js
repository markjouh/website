import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-ai.js";

const firebaseConfig = {
    apiKey: "AIzaSyDh3STK0hTEbS66Cel1s9WAV4qPjmMLglo",
    authDomain: "markjouh-com-assistant.firebaseapp.com",
    projectId: "markjouh-com-assistant",
    storageBucket: "markjouh-com-assistant.firebasestorage.app",
    messagingSenderId: "160360406014",
    appId: "1:160360406014:web:6703b41c6000b3a0c17eaf"
};

const app = initializeApp(firebaseConfig);
const ai = getAI(app, { backend: new GoogleAIBackend() });

const systemPrompt = await fetch("prompt.txt").then(r => r.text());
const model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
        maxOutputTokens: 1000,
        thinkingConfig: { thinkingBudget: 0 }
    }
});

const MAX_HISTORY = 10;
let chatHistory = [];
let chat = model.startChat();

const chatBox = document.getElementById("chat-box");
const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");
const chatHeader = document.getElementById("chat-header");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const charCount = document.getElementById("char-count");
const submitBtn = form.querySelector("button");
const messages = document.getElementById("chat-messages");

input.addEventListener("input", () => {
    charCount.textContent = `${input.value.length}/500`;
});

let isLoading = false;

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Toggle open/close
chatToggle.addEventListener("click", (e) => {
    e.preventDefault();
    chatBox.classList.toggle("open");
});
chatClose.addEventListener("click", () => chatBox.classList.remove("open"));

// Dragging
let isDragging = false, offsetX, offsetY;
chatHeader.addEventListener("mousedown", (e) => {
    if (e.target === chatClose) return;
    isDragging = true;
    offsetX = e.clientX - chatBox.offsetLeft;
    offsetY = e.clientY - chatBox.offsetTop;
});
document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const boxWidth = chatBox.offsetWidth;
    const boxHeight = chatBox.offsetHeight;
    const maxX = window.innerWidth - boxWidth;
    const maxY = window.innerHeight - boxHeight;
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    chatBox.style.left = newX + "px";
    chatBox.style.top = newY + "px";
    chatBox.style.right = "auto";
    chatBox.style.bottom = "auto";
});
document.addEventListener("mouseup", () => isDragging = false);

// Chat submit
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isLoading) return;

    messages.innerHTML += `<div class="msg user">${escapeHtml(text)}</div>`;
    input.value = "";
    charCount.textContent = "0/500";

    // Show loading state
    isLoading = true;
    submitBtn.disabled = true;
    const responseEl = document.createElement("div");
    responseEl.className = "msg bot loading";
    responseEl.innerHTML = `<svg class="loading-square" width="16" height="16" viewBox="0 0 16 16">
        <rect x="4" y="4" width="8" height="8" fill="currentColor"/>
    </svg>`;
    messages.appendChild(responseEl);
    messages.scrollTop = messages.scrollHeight;

    try {
        const result = await chat.sendMessageStream(text);
        let fullText = "";
        let firstChunk = true;
        for await (const chunk of result.stream) {
            if (firstChunk) {
                responseEl.classList.remove("loading");
                firstChunk = false;
            }
            fullText += chunk.text();
            responseEl.textContent = fullText;
            messages.scrollTop = messages.scrollHeight;
        }

        // Track history and trim if needed
        chatHistory.push({ role: "user", parts: [{ text }] });
        chatHistory.push({ role: "model", parts: [{ text: fullText }] });
        if (chatHistory.length > MAX_HISTORY * 2) {
            chatHistory = chatHistory.slice(-MAX_HISTORY * 2);
            chat = model.startChat({ history: chatHistory });
        }
    } catch (err) {
        responseEl.classList.remove("loading");
        responseEl.textContent = "Error: " + err.message;
    }

    isLoading = false;
    submitBtn.disabled = false;
});
