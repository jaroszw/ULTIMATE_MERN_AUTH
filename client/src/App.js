import axios from "axios";
import { useEffect } from "react";

function App() {
  // useEffect(() => {
  //   const getError = async () => {
  //     try {
  //       const res = await axios.post(
  //         "http://localhost:3000/user/activation/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmFuZGFsIiwiZW1haWwiOiJqYXJvc3p3QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjM5MTE0MzI0fQ.hMFzt0G0Tg0ubu_01qDi15JYXAHU4IU_qJvLFqfmrWs",
  //         {
  //           email: "jaroszw@gmail.com",
  //           password: 123456,
  //         }
  //       );

  //       console.log(res);
  //     } catch (error) {
  //       console.dir(error);
  //     }
  //   };

  //   getError();
  // }, []);

  return (
    <div>
      <h1>APP</h1>
    </div>
  );
}

export default App;
