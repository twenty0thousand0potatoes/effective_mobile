import express from "express";
import { prisma } from "../prisma/prisma.client.js";
import { logAction } from "../logger.action.js";

const product_router = express.Router();

product_router.post("", async (req, res) => {
  try {
    const { plu, name } = req.body;

    if (!plu || !name) { 
      return res.status(400).json({ error: "PLU and name are required." });
    }

    const existingProduct = await prisma.product.findUnique({ where: { plu } });
    if (existingProduct) {
      return res.status(400).json({ error: "PLU already exists." });
    }

    const newProduct = await prisma.product.create({
      data: { plu, name },
    });

    await logAction("create", newProduct.id, null, "Product created");

    res.status(201).json(newProduct);
  } catch (e) {
    console.error("Error creating product:", e);
    res.status(500).json({
      error: "Internal server error. Failed to create product.",
      details: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

product_router.get("", async (req, res) => {
  try {
    const { plu, name } = req.query;
    console.log(plu, name);

    const filters= {};

    if (name) {
      filters.name = { contains: name, mode: "insensitive" };
    }
    if (plu) {
      filters.plu = plu;
    }

    const products = await prisma.product.findMany({ where: filters });
    await logAction("search", null, null, `Products searched with filters: PLU=${plu || "any"}, Name=${name || "any"}`);

    res.status(200).json(products);
  } catch (e) {
    console.error("Error fetching products:", e);
    res.status(500).json({
      error: "Internal server error. Failed to fetch products.",
      details: e instanceof Error ? e.message : "Unknown error",
    });
  }
}); 

export { product_router };
