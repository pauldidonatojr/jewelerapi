const app = require('./app');
const cors = require("cors");
const port = process.env.PORT || 9292;
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
