export const config = {
  api: {
    externalResolver: true,
  },
}

export default function handler(req, res) {
  return res.status(200).json({message:"test check"})
}
