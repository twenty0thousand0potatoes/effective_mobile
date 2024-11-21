import express from "express";
import { prisma } from "../prisma/prisma.client.js";
import { logAction } from "../logger.action.js";

export const stocks_router = express.Router();

stocks_router.post("", async (req, res) => {
  try {
    const { productId, shopId, quantityOnShelf, quantityInOrder } = req.body;
    if (!productId || !shopId) {
      return res
        .status(400)
        .json({ error: "Product ID and Shop ID are required." });
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      return res.status(404).json({ error: "Product not found." });
    }
    const shopExists = await prisma.shop.findUnique({
      where: { id: shopId },
    });
    if (!shopExists) {
      return res.status(404).json({ error: "Shop not found." });
    }
    const existingStock = await prisma.stock.findUnique({
      where: {
        productId_shopId: {
          productId,
          shopId,
        },
      },
    });

    if (existingStock) {
      return res.status(400).json({
        error: "Stock entry already exists for this product and shop.",
      });
    }

    const newStock = await prisma.stock.create({
      data: {
        productId,
        shopId,
        quantityOnShelf: quantityOnShelf || 0,
        quantityInOrder: quantityInOrder || 0,
      },
    });
    await logAction("create", productId, shopId, "Stock created");

    res.status(201).json(newStock);
  } catch (e) {
    console.error("Error creating stock:", e);
    if (e.code === "P2003") {
      return res.status(400).json({
        error: "Foreign key constraint violated.",
        details: e.message,
      });
    }

    res.status(500).json({
      error: "Internal server error. Failed to create stock.",
      details: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

stocks_router.put("/:id/increase", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityOnShelf, quantityInOrder } = req.body;

    const stock = await prisma.stock.findUnique({
      where: { id: parseInt(id) },
    });

    if (!stock) {
      return res.status(404).json({
        error: "Stock entry not found.",
        details: `No stock found with ID ${id}`,
      });
    }

    const updatedStock = await prisma.stock.update({
      where: { id: parseInt(id) },
      data: {
        quantityOnShelf: quantityOnShelf
          ? { increment: quantityOnShelf }
          : undefined,
        quantityInOrder: quantityInOrder
          ? { increment: quantityInOrder }
          : undefined,
      },
    });

    await logAction(
      "increase",
      updatedStock.productId,
      updatedStock.shopId,
      `Stock increased: Shelf=${quantityOnShelf || 0}, Order=${
        quantityInOrder || 0
      }`
    );

    res.status(200).json(updatedStock);
  } catch (e) {
    console.error("Error increasing stock:", e);
    if (e.code === "P2025") {
      return res.status(404).json({
        error: "Stock entry not found.",
        details: `No stock found with ID ${req.params.id}`,
      });
    }
    res.status(500).json({
      error: "Internal server error. Failed to increase stock.",
      details: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

stocks_router.put("/:id/decrease", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityOnShelf, quantityInOrder } = req.body;

    const stock = await prisma.stock.findUnique({
      where: { id: parseInt(id) },
    });

    if (!stock) {
      return res.status(404).json({
        error: "Stock entry not found.",
        details: `No stock found with ID ${id}`,
      });
    }

    const updatedStock = await prisma.stock.update({
      where: { id: parseInt(id) },
      data: {
        quantityOnShelf: quantityOnShelf
          ? { decrement: quantityOnShelf }
          : undefined,
        quantityInOrder: quantityInOrder
          ? { decrement: quantityInOrder }
          : undefined,
      },
    });

    await logAction(
      "decrease",
      updatedStock.productId,
      updatedStock.shopId,
      `Stock decreased: Shelf=${quantityOnShelf || 0}, Order=${
        quantityInOrder || 0
      }`
    );

    res.status(200).json(updatedStock);
  } catch (e) {
    console.error("Error decreasing stock:", e);
    if (e.code === "P2025") {
      return res.status(404).json({
        error: "Stock entry not found.",
        details: `No stock found with ID ${req.params.id}`,
      });
    }
    res.status(500).json({
      error: "Internal server error. Failed to decrease stock.",
      details: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

stocks_router.get("", async (req, res) => {
  try {
    const filters = {};

    const { plu, shopId, quantityOnShelf, quantityInOrder } = req.query;

    if (plu) {
      const product = await prisma.product.findUnique({
        where: { plu },
      });
      if (product) {
        filters.productId = product.id;
      } else {
        return res
          .status(400)
          .json({ error: "Product with the given PLU not found." });
      }
    }

    if (shopId) {
      filters.shopId = parseInt(shopId, 10);
    }

    if (quantityOnShelf) {
      filters.quantityOnShelf = { gte: parseInt(quantityOnShelf, 10) };
    }

    if (quantityInOrder) {
      filters.quantityInOrder = { gte: parseInt(quantityInOrder, 10) };
    }

    const stocks = await prisma.stock.findMany({
      where: filters,
    });

    await logAction(
      "search",
      null,
      shopId ? parseInt(shopId, 10) : null,
      `Stocks searched with filters: PLU=${plu || "any"}, ShopID=${
        shopId || "any"
      }`
    );

    res.status(200).json(stocks);
  } catch (e) {
    console.error("Error getting stock:", e);
    res.status(500).json({
      error: "Internal server error. Failed to fetch stocks.",
      details: e instanceof Error ? e.message : "Unknown error",
    });
  }
});
