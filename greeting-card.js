document.getElementById('createButton').addEventListener('click', function() {
    const message = document.getElementById('message').value;
    const name = document.getElementById('name').value;
    const fileInput = document.getElementById('background');
    const file = fileInput.files[0];

    if (!message || !name || !file) {
        alert('Please fill in all fields and upload an image.');
        return;
      }

      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
 const reader = new FileReader();

      reader.onload = function(event) {
        img.src = event.target.result;
        img.onload = function() {
          // Set canvas size to match the image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw background image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Text parameters
          const maxWidth = canvas.width * 0.8; // 80% of the canvas width
          const x = canvas.width / 2; // Center horizontally
          const y = canvas.height / 3; // Initial text Y position
          const lineHeight = 40;
          const topPadding = 20; // Space between shadow and text
          const namePadding = 40; // Padding for name within the shadow box

          // Function to wrap text
          const wrapText = (ctx, text, maxWidth) => {
            const words = text.split(' ');
            let line = '';
            const lines = [];
            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + ' ';
              const testWidth = ctx.measureText(testLine).width;
              if (testWidth > maxWidth && i > 0) {
                lines.push(line);
                line = words[i] + ' ';
              } else {
                line = testLine;
              }
            }
            lines.push(line);
            return lines;
          };

          // Calculate lines and adjust font size dynamically
          let fontSize = 30;
          ctx.font = `${fontSize}px Arial`;
          let lines = wrapText(ctx, message, maxWidth);

          while (lines.length * lineHeight > canvas.height / 3) {
            fontSize -= 2;
            ctx.font = `${fontSize}px Arial`;
            lines = wrapText(ctx, message, maxWidth);
          }

          // Calculate shadow box height dynamically based on text size + name
          const boxHeight = lines.length * lineHeight + namePadding + topPadding;
          const boxWidth = maxWidth + 40; // Add some padding to width
          const boxX = (canvas.width - boxWidth) / 2; // Center horizontally
          const boxY = y - topPadding - lineHeight / 2; // Adjust for top padding

          // Draw shadow box behind text and name
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black
          ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

          // Adjust starting position of the text to account for padding
          const textStartY = boxY + topPadding + lineHeight;

          // Draw the wrapped message text
          ctx.fillStyle = 'white'; // Message text color
          ctx.textAlign = 'center';
          lines.forEach((line, index) => {
            ctx.fillText(line, x, textStartY + index * lineHeight);
          });

          // Draw the name inside the shadow box, below the message
          ctx.font = `${fontSize - 5}px Arial`;
          ctx.fillStyle = 'red'; // Name text color
          ctx.fillText(`- ${name}`, x, textStartY + lines.length * lineHeight + 20); // Ensure name fits inside

          // Display and download the greeting card
          const link = document.createElement('a');
          link.download = 'greeting-card.png';
          link.href = canvas.toDataURL();
          link.click();
        };
      };
      reader.readAsDataURL(file);
    })