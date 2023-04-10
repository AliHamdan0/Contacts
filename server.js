const express = require('express');
const dotenv = require('dotenv').config();
const contactsRouter = require('./Routes/contacts');
const userRouter = require('./Routes/user');
const errorHandler = require('./middlewares/errorHandler');
const connect = require('./config/dbConnection');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const PORT = process.env.PORT || 5000;

connect();
const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
app.use(express.json());
app.use('/api/contacts', contactsRouter);
app.use('/api/users', userRouter);
app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
