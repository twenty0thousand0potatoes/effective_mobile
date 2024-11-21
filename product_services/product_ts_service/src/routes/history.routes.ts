import express, { Router, Response, Request } from "express";
import { CreateActionDto } from "../dto/action.dto.js";
import { validateDto } from "../middleware.dto.js";
import { prisma } from "../db/prisma.client.js";

export const history_route = Router();

history_route.get('/', async(req:Request, res:Response):Promise<void> => {
  res.status(200).json("ok");
});

history_route.get("/data", async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id, plu, action, date_from, date_to } = req.query;

    const filters: any = {};

    if (shop_id) {
      filters.shopId = Number(shop_id); 
    }

    if (plu) {
      filters.productId = Number(plu); 
    }

    if (action) {
      filters.actionType = String(action); 
    }

    if (date_from || date_to) {
      filters.actionDate = {};
      if (date_from) {
        filters.actionDate.gte = new Date(date_from as string); 
      }
      if (date_to) {
        filters.actionDate.lte = new Date(date_to as string); 
      }
    }

    const actions = await prisma.action.findMany({
      where: filters,
      orderBy: {
        actionDate: "desc", 
      },
    });

    res.status(200).json(actions);
  } catch (error) {
    console.error("Error fetching actions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


history_route.post(
  "",
  validateDto(CreateActionDto), 
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { actionType, productId, shopId, changeQuantity, description } = req.body;

      const newAction = await prisma.action.create({
        data: {
          actionType,
          productId,
          shopId,
          changeQuantity,
          description,
          actionDate: new Date(), 
        },
      });

      res.status(201).json(newAction);
    } catch (e) {
      if (e instanceof Error) {
        console.error("Unexpected error:", e);
        res.status(500).json({
          message: "Internal server error",
          details: e.message,
        });
      } else {
        console.error("Unexpected error:", e);
        res.status(500).json({
          message: "Unexpected error occurred",
        });
      }
    }
  }
);

