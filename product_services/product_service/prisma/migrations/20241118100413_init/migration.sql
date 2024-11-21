-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "plu" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "quantityOnShelf" INTEGER NOT NULL DEFAULT 0,
    "quantityInOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_plu_key" ON "Product"("plu");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productId_shopId_key" ON "Stock"("productId", "shopId");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
