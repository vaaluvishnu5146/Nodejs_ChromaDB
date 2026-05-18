const { ChromaClient } = require("chromadb");

const client = new ChromaClient({
  // path: "http://localhost:8000",
  host: "localhost",
  port: 8000,
});

/**
 * List all database running in server
 */
async function listDatabases() {
  const command = process.argv[2];

  if (command === "list") {
    const dbs = await client.database;

    console.log(dbs);
  }
}

/**
 * Create a collection inside a default_database
 */
async function createCollection() {
  const collection = await client.createCollection({
    name: "products",
  });

  console.log(collection);
}

/**
 * List all collections inside a default_database
 */
async function listCollections() {
  const command = process.argv[2];

  if (command === "list") {
    const collections = await client.listCollections();

    console.log(collections);
  }
}

async function getCollection() {
  const collection = await client.getCollection({
    name: "products",
  });

  console.log(collection);
}

async function insertData() {
  const collection = await client.getCollection({
    name: "products",
  });

  // await collection.add({
  //   ids: ["3", "4"],

  //   documents: ["iPhone 15 Pro Max", "Samsung Galaxy S24"],

  //   metadatas: [{ brand: "Apple" }, { brand: "Samsung" }],

  //   embeddings: [
  //     [0.1, 0.2, 0.3],
  //     [0.4, 0.5, 0.6],
  //   ],
  // });

  await collection.add({
    ids: ["8", "9", "10", "11"],
    documents: ["Cheetah", "Leopard", "Jaguar", "Tiger"],
    metadatas: [
      { animal: "Cheetah" },
      { animal: "Leopard" },
      { animal: "Jaguar" },
      { animal: "Tiger" },
    ],
    embeddings: [
      [0.99, 0.6, 0.95],
      [0.82, 0.78, 0.96],
      [0.75, 0.92, 0.98],
      [0.7, 0.99, 0.99],
    ],
  });

  console.log("Inserted");
}

insertData();

//
// | Word | Embedding Vector     |
// | ---- | -------------------- |
// | CAT  | `[0.90, 0.95, 0.20]` |
// | DOG  | `[0.92, 0.98, 0.15]` |
// | LION | `[0.97, 0.05, 0.99]` |
// | Animal  | Embedding Vector     |
// | ------- | -------------------- |
// | Cheetah | `[0.99, 0.60, 0.95]` |
// | Leopard | `[0.82, 0.78, 0.96]` |
// | Jaguar  | `[0.75, 0.92, 0.98]` |
// | Tiger   | `[0.70, 0.99, 0.99]` |

async function getProductsData() {
  const collection = await client.getCollection({
    name: "products",
  });

  const result = await collection.get({
    ids: ["6"],
    include: ["embeddings", "metadatas"],
  });

  console.log(result);
}

async function searchBasedOnVectorEmbeddings() {
  const collection = await client.getCollection({
    name: "products",
  });

  const results = await collection.query({
    queryEmbeddings: [[0.95, 0.98, 0.05]],
    include: ["embeddings", "metadatas"],
    where: {
      animal: "dog",
    },
  });

  // Format and display the results
  results.ids[0].forEach((id, index) => {
    console.log(`Result ${index + 1}:`);
    console.log(`ID: ${id}`);
    console.log(`Metadata:`, results.metadatas[0][index]);
    console.log(`Embedding:`, results.embeddings[0][index]);
    console.log("-------------------------");
  });
}

searchBasedOnVectorEmbeddings();
