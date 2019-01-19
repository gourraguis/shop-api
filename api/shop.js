
module.exports.list = (event, context, cb) => {
    const shops = dummyData().sort((a, b) => a.distance - b.distance)
    const response = {
        statusCode: 200,
        body: JSON.stringify(shops)
    }
    cb(null, response)
}

const dummyData = () => ([
    {
        name: "Awesome Shop Name 1",
        distance: 3,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
    },
    {
        name: "Awesome Shop Name 2",
        distance: 4,
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc"
    },
    {
        name: "Awesome Shop Name 3",
        distance: 19,
        image: "https://images.unsplash.com/photo-1515165359388-5309c518b140"
    },
    {
        name: "Awesome Shop Name 4",
        distance: 25,
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9"
    },
    {
        name: "Awesome Shop Name 5",
        distance: 5,
        image: "https://images.unsplash.com/photo-1511120096-e7744308d1d2"
    },
    {
        name: "Awesome Shop Name 6",
        distance: 9,
        image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760"
    },
    {
        name: "Awesome Shop Name 7",
        distance: 11,
        image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247"
    },
    {
        name: "Awesome Shop Name 8",
        distance: 15,
        image: "https://images.unsplash.com/photo-1507914372368-b2b085b925a1"
    },
])