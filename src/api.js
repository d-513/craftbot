const axios = require('axios').default

module.exports.ping = async (ip) => {
  const { data } = await axios.get(`https://api.mcsrvstat.us/2/${ip}`)
  if (!data.online) throw new Error('Server is offline')
  return data
}
