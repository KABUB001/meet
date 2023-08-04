const express = require("express");
const cors = require("cors");
const axios = require("axios");


const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
const server = require("http").createServer(app);

//MESSAGE


const CHAT_ENGINE_PROJECT_ID = "7f0462df-c7e9-437e-97ca-693fa04815af";
const CHAT_ENGINE_PRIVATE_KEY = "0929688a-5378-46e8-90bc-9b97fdb16372";

app.post("/signup", async (req, res) => {
  const { username, secret, email, first_name, last_name } = req.body;
 console.log(req.body);
  // Store a user-copy on Chat Engine!
  // Docs at rest.chatengine.io
  try {
    const r = await axios.post(
      "https://api.chatengine.io/users/",
      { username, secret, email, first_name, last_name },
      { headers: { "Private-Key": CHAT_ENGINE_PRIVATE_KEY } }
    );
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { username, secret } = req.body;

  // Fetch this user from Chat Engine in this project!
  // Docs at rest.chatengine.io
  try {
    const r = await axios.get("https://api.chatengine.io/users/me/", {
      headers: {
        "Project-ID": CHAT_ENGINE_PROJECT_ID,
        "User-Name": username,
        "User-Secret": secret,
      },
    });
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});
//MESSAGE

//CALL

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/call', (req, res) => {
	res.send('Running');
});


const users = {};

io.on("connection", (socket) => {
	if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
	socket.emit("yourID", socket.id);
	socket.emit("me", socket.id);

	io.sockets.emit("allUsers", users);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
		delete users[socket.id];
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));