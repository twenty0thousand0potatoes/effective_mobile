-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "actionType" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "changeQuantity" INTEGER,
    "description" TEXT,
    "actionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);
