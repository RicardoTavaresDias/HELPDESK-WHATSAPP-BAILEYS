export const tablePostgres = `
  enum UserRole {
    technical
    customer
    admin
  }

  model User {
    id String @id @default(uuid())
    name String
    email String @unique
    password String
    role UserRole @default(customer)
    avatar String @default("default.svg")
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime? @updatedAt @map("updated_at")

    userHours UserHours []
    calledCustomer Called[] @relation("CustomerCalls")
    calledTechnical Called[] @relation("TechnicalCalls")
    calledComments CalledComments[]

    @@map("user")
  }

  model UserHours {
    id String @id @default(uuid())
    fkUserTechnical String @map("fk_user_technical")
    startTime DateTime @map("start_time")
    endTime DateTime @map("end_time")
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime? @updatedAt @map("updated_at")

    user User @relation(fields: [fkUserTechnical], references: [id], onDelete: Cascade)

    @@map("user_hours")
  } 

  enum CalledStatus {
    open 
    close
    in_progress
  }

  model Called {
    id Int @id @default(autoincrement())
    fkUserCustomer String @map("fk_user_customer")
    fkUserTechnical String? @map("fk_user_technical")
    titleCalled String @map("title_called")
    description String
    basePrice Decimal @db.Decimal(10, 2)
    callStatus CalledStatus @default(open) @map("call_status")
    appointmentTime DateTime @map("appointment_Time")
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime? @updatedAt @map("updated_at")

    UserCustomer User @relation("CustomerCalls", fields: [fkUserCustomer], references: [id], onDelete: Cascade)
    UserTechnical User? @relation("TechnicalCalls", fields: [fkUserTechnical], references: [id], onDelete: Cascade)
    services CalledServices[]
    calledComments CalledComments[]

    @@map("called")
  }

  enum ServicesStatus {
    active
    inactive
  }

  model Services {
    id String @id @default(uuid())
    titleService String @map("title_service")
    price Decimal @db.Decimal(10, 2)
    serviceStatus ServicesStatus @default(active) @map("service_status")
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime? @updatedAt @map("updated_at")

    calledServices CalledServices[]

    @@map("services")
  }

  model CalledServices {
    id String @id @default(uuid())
    fkCalled Int @map("fk_called")
    fkServices String @map("fk_services")
    titleService String @map("title_service")
    price Decimal @db.Decimal(10, 2)
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime? @updatedAt @map("updated_at")

    called Called @relation(fields: [fkCalled], references: [id], onDelete: Cascade)
    services Services @relation(fields: [fkServices], references: [id], onDelete: Cascade)

    @@map("called_services")
  }

  model CalledComments {
    id String @id @default(uuid())
    fkCalled Int @map("fk_called")
    fkComments String @map("fk_comments")
    fkUser String @map("fk_user")
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime? @updatedAt @map("updated_at")

    called Called @relation(fields: [fkCalled], references: [id], onDelete: Cascade)
    comment Comments @relation(fields: [fkComments], references: [id], onDelete: Cascade)
    user User @relation(fields: [fkUser], references: [id], onDelete: Cascade)

    @@map("called_comments")
  }

  enum TypeComment {
    followUp
    task
  }

  model Comments {
    id String @id @default(uuid())
    description String
    type TypeComment @default(followUp)
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime? @updatedAt @map("updated_at")

    calledComments CalledComments[]

    @@map("comments")
  }
`.trim()