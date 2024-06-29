const express = require("express");
const bodyParser = require("body-parser");
const adminRouter = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
const errorController = require("./controllers/error");

const User = require("./models/user");

// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findOne({ email: "test@gmail.com" })
    .then((user) => {
      if (!user) {
        const dummyUser = new User({
          name: "Test User",
          email: "test@gmail.com",
          cart: { items: [] },
        });
        return dummyUser.save();
      }
      return user;
    })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRouter);
app.use(shopRoutes);

app.use(errorController.get404);

// const user = new User("roger", "roger@test.com", { items: [] });
// user.save();
mongoose
  .connect(
    "mongodb+srv://ecarreon:ApHIXJnZ8F6RxNL9@cluster0.u5nus6s.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    app.listen(3000);
  });
