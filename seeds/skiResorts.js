module.exports = [

        {
          name: "Aspen Snowmass",
          location: {
            city: "Aspen",
            state: "Colorado",
            country: "USA",
            coordinates: {
              latitude: "39.1911",
              longitude: "-106.8175"
            }
          },
          description: "Renowned for its four mountains, world-class skiing, and vibrant town.",
          prices: {
            daily: "$80 - $150",
            season_pass: "$800 - $1,500"
          },
          image: "example.com/aspen-image"
        },
        {
          name: "Whistler Blackcomb",
          location: {
            city: "Whistler",
            province: "British Columbia",
            country: "Canada",
            coordinates: {
              latitude: "50.1163",
              longitude: "-122.9574"
            }
          },
          description: "One of the largest ski resorts in North America with diverse terrain.",
          prices: {
            daily: "$90 - $160",
            season_pass: "$900 - $1,600"
          },
          image: "example.com/whistler-image"
        },

            {
              name: "Chamonix-Mont-Blanc",
              location: {
                city: "Chamonix",
                state: null,  // Use null if there is no state or province
                country: "France",
                coordinates: {
                  latitude: "45.9237",
                  longitude: "6.8694"
                }
              },
              description: "Situated in the French Alps, known for challenging slopes and stunning views.",
              prices: {
                daily: "$70 - $130",
                season_pass: "$700 - $1,300"
              },
              image: "example.com/chamonix-image"
            },
            {
              name: "Zermatt - Matterhorn",
              location: {
                city: "Zermatt",
                state: null,
                country: "Switzerland",
                coordinates: {
                  latitude: "46.0207",
                  longitude: "7.7491"
                }
              },
              description: "Famous for the iconic Matterhorn peak, offers excellent skiing and picturesque surroundings.",
              prices: {
                daily: "$80 - $140",
                season_pass: "$800 - $1,400"
              }
            }
        // Add more ski resorts as needed
      ]
