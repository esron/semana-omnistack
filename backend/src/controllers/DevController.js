const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

module.exports = {
  async index (req, res) {
    const devs = await Dev.find()

    return res.json(devs)
  },

  async store (req, res) {
    const { github_username: githubUsername, techs, latitude, longitude } = req.body

    let dev = await Dev.findOne({ githubUsername })

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${githubUsername}`)

      const { name, avatar_url: avatarUrl, bio } = apiResponse.data

      const techsArray = parseStringAsArray(techs)

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      dev = await Dev.create({
        github_username: githubUsername,
        avatar_url: avatarUrl,
        techs: techsArray,
        name: name || githubUsername,
        bio,
        location
      })

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      )

      sendMessage(sendSocketMessageTo, 'new-dev', dev)
    }

    return res.json(dev)
  }
}
