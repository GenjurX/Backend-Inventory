import express, { response } from "express";
import cors from "cors";
import database from "../src/database.js";

const app = express();
app.use(express.json());
app.use(cors());

//route for searching your sites
app.get("/api/search/:searchValue", async (req, res) => {
  const searchValue = req.params.searchValue;
  const result = await database.raw(
    `select * from sites where name like '%${searchValue}%' or category like '%${searchValue}%' or status like '%${searchValue}%'`,
  );
  res.status(200);
  res.json(result);
});

//route for searching items
app.get("/api/search/:site_id/items/:searchValue", async (req, res) => {
  const searchValue = req.params.searchValue;
  const site_id = req.params.site_id;
  const result = await database.raw(`select * from items where site_id=${site_id} and (description like '%${searchValue}%' or notes like '%${searchValue}%' or item like '%${searchValue}%') `);
  res.status(200);
  res.json(result);
});

//create a new jobsite
app.post("/api/sites", async (req, res) => {
  const { category, name, status } = req.body;
  const insert = await database.raw(
    `insert into sites (category, name, status) values ('${category}','${name}', '${status}')`,
  );
  const id = insert.lastInsertRowid;
  const result = await database.raw(`select * from sites where id= ${id}`);
  res.status(200);
  res.json(result);
});

//get all jobsites
app.get("/api/sites", async (req, res) => {
  const result = await database.raw(`select * from sites`);
  res.status(200);
  res.json(result);
});

//get one single site
app.get("/api/sites/:id", async (req, res) => {
  const id = req.params.id;
  const result = await database.raw(`select * from sites where id='${id}'`);
  res.status(200);
  res.json(result);
});

//get the items of the specific jobsite
app.get("/api/sites/:id/items", async (req, res) => {
  const id = req.params.id;
  const result = await database.raw(`select * from items where site_id='${id}'`);
  res.status(200);
  res.json(result);
});

//update the item
app.put("/api/item/:id", async (req, res) => {
  const id = req.params.id;
  const { item, quantity, description, notes } = req.body;
  await database.raw(`update items set item='${item}', quantity='${quantity}', description='${description}', notes='${notes}' where id=${id}`);
  const result = await database.raw(`select * from items where id= ${id}`);
  res.status(200);
  res.json(result);
});

//update note
app.put("/api/site/:id", async (req, res) => {
  const id = req.params.id;
  const { category, name, status } = req.body;
  await database.raw(`update sites set name='${name}', category='${category}', status='${status}' where id=${id}`);
  const result = await database.raw(`select * from sites where id= ${id}`);
  res.status(200);
  res.json(result);
});

//delete note
app.delete("/api/site/:id", async (request, response) => {
  const id = request.params.id;
  await database.raw(`delete from sites where id=${id}`);
  const result = await database.raw(`select * from sites`);
  response.status(200);
  response.json(result);
});

//Route that handles every other route
app.all("/*", async (request, response) => {
  response.status(404);
  response.json({ error: "This route does not exist" });
});

const hostname = "localhost";
const port = 4000;

app.listen(port, hostname, () => {
  console.log(`Server listening on http://${hostname}:${port}`);
});
