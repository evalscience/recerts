export async function POST() {
	const baseUrl = "https://ecocertain.xyz"; // <-- Replace with your actual base URL

	return new Response(
		`<!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="Welcome to Ecocerts" />
        <meta property="og:description" content="Fund impactful regenerative projects" />
        <meta property="og:image" content="${baseUrl}/farcaster-frame.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:button:1" content="Browse Ecocerts" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}" />
      </head>
      <body></body>
    </html>`,
		{
			headers: {
				"Content-Type": "text/html",
			},
		},
	);
}
