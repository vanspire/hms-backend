-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "city" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "houseAddress" TEXT,
ADD COLUMN     "houseName" TEXT,
ADD COLUMN     "houseNumber" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "localArea" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT;

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "chiefComplaint" TEXT,
    "diagnosis" TEXT,
    "medications" JSONB,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visit_appointmentId_key" ON "Visit"("appointmentId");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
