export default function handler(req, res) {
  const userQuery = req.query;
  fetch(process.env.PASSPORT_AUTH_ENDPOINT, {
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
        return response.json();
      }
    })
    .then((data) => {
      const bearerToken = data["access_token"];
      let enforcementURL = `${process.env.PASSPORT_ENFORCEMENT_ENDPOINT}?operator_id=${process.env.PASSPORT_OPERATOR_ID}&vehicle_plate=${userQuery.vehicle_plate}`;
      // if (form.state.length > 0) {
      //   queryURL = queryURL + `&vehicle_state=${form.state}`;
      // }
      fetch(enforcementURL, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
}
