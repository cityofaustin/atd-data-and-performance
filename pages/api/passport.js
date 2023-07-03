export default async function handler(req, res) {
  const userQuery = req.query;
  await fetch(process.env.PASSPORT_AUTH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.PASSPORT_CLIENT_ID,
      client_secret: process.env.PASSPORT_CLIENT_SECRET,
      audience: "public.api.passportinc.com",
    }),
  })
    .then((response) => {
      if (response.status !== 200) {
        return res.status(response.status).json();
      } else {
        const data = response.json();
        console.log(data)
        const bearerToken = data["access_token"];
      }
    })
    .catch((err) => console.error(err));
  // res.status(200).json({ name: 'John Doe' })
}
