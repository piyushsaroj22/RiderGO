import { AccountType } from "../utils/jwt.js";

import type { UserDocument } from "../modules/user/user.model.js";
import type { DriverDocument } from "../modules/driver/driver.model.js";
import type { AdminDocument } from "../modules/admin/admin.model.js";

declare global {
  namespace Express {
    interface Request {
      account: UserDocument | DriverDocument | AdminDocument;
      accountType: AccountType;
    }
  }
}

export {};
