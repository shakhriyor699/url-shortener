import axios from "axios"

export const shortenUrl = async (url: string) => {
  const res = await axios.post("http://localhost:5050/api/url/shorten", {
    url
  })

  return res.data
}
