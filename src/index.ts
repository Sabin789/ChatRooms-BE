
import listEndpoints from "express-list-endpoints";
import UsersRouter from "./Api/Users";
import { pgConnect } from "./db";
import { expressServer, httpServer } from "./server";


const port=process.env.PORT || 3001

const startServer = async () => {
    try {
      // Connect to the database
      await pgConnect();
  
      // Start the Express server
      httpServer.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    } catch (error) {
      console.error("Error starting server:", error);
      process.exit(1);
    }
  }


startServer()

// httpServer.listen(port,()=>{
//     console.table(listEndpoints(expressServer))
//     console.log(`Connected to port ${port}`)
//  })