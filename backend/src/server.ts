import app from "./app.js";
import ENV from "./config/env.js";

const PORT = Number(ENV.PORT);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
