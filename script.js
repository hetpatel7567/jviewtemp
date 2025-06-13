document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('messageContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const periodElement = document.querySelector('.period');
    const dateValueElement = document.getElementById('dateValue');

    // Update time and date
    function updateDateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const period = hours >= 12 ? 'Pm' : 'Am';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12;

        hoursElement.textContent = hours;
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        periodElement.textContent = period;

        // Update date value (using a format similar to the screenshot)
        dateValueElement.textContent = (now.getMonth() + 1).toFixed(2);
    }

    // Update time every second
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Load existing messages
    loadMessages();

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender.toLowerCase()}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const text = document.createElement('p');
        text.textContent = message.text;
        
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = message.timestamp;
        
        messageContent.appendChild(text);
        messageContent.appendChild(timestamp);
        messageDiv.appendChild(messageContent);
        
        return messageDiv;
    }

    async function loadMessages() {
        try {
            const response = await fetch('/get_messages');
            const messages = await response.json();
            
            messages.forEach(message => {
                messageContainer.appendChild(createMessageElement(message));
            });
            
            scrollToBottom();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    async function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (!messageText) return;
        
        try {
            const response = await fetch('/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: messageText,
                    sender: 'User'
                })
            });
            
            const message = await response.json();
            messageContainer.appendChild(createMessageElement(message));
            
            // Clear input and scroll to bottom
            messageInput.value = '';
            scrollToBottom();
            
            // Simulate bot response
            setTimeout(simulateBotResponse, 1000);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    function simulateBotResponse() {
        const responses = [
            "I understand your request.",
            "Let me think about that...",
            "I'm processing your input.",
            "Interesting question!",
            "I'm here to help."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: randomResponse,
                sender: 'Jarvis'
            })
        })
        .then(response => response.json())
        .then(message => {
            messageContainer.appendChild(createMessageElement(message));
            scrollToBottom();
        })
        .catch(error => console.error('Error with bot response:', error));
    }

    function scrollToBottom() {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});
