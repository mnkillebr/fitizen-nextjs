export const magicLinkEmailTemplate = (link: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log in to Fitizen</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #fbbf24;
      color: #000;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #f59e0b;
    }
  </style>
</head>
<body>
  <h1>Log in to the Fitizen App</h1>
  <p>You're one step closer to your healthiest mindset! Click the link below to log in.</p>
  <a href="${link}" class="button">Log In</a>
  <p>If you didn't request this email, you can safely ignore it.</p>
</body>
</html>
`; 