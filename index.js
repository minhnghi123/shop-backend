const express = require("express");
var methodOverride = require("method-override");
const app = express();
//using dotenv makes the security of the port
require("dotenv").config();
const port = process.env.PORT;
const bodyParser = require("body-parser");

//show notifications
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.set("views", `${__dirname}/views`); // Tìm đến thư mục tên là views-> up len render
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh-> up len render

app.use(cookieParser("CODE"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

const systemConfig = require("./config/system"); //config admin route -> security
app.locals.prefixAdmin = systemConfig.prefixAdmin; //declare a public prefixAdmin for all pug files

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

//using body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // form
//database connection ;
const mongoose = require("mongoose");
const database = require("./config/database");
database();

const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

//Prioritize admin over client
routeAdmin.routeAdmin(app);
routeClient.routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
