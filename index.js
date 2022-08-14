const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const authRouter = require("./authRouter");
const usersRouter = require("./usersRouter");
const noteRouter = require("./noteRouter");

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(morgan("tiny"));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/notes", noteRouter);

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO);
		app.listen(port, () => {
			console.log(`Server started on port ${port}`);
		});
		app.use(express.static(`${__dirname}/public`));
	} catch (e) {
		console.log(e);
	}
};

start();

app.use(errorHandler);

function errorHandler(err, req, res, next) {
	console.error(err);
	res.status(500).send({ message: "Server error" });
}
