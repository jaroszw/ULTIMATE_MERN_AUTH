import axios from "axios";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const getError = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/register", {
          email: "jaroszw@gmail.com",
          name: "Vandal",
          password: "123456",
        });
        console.log(res);
      } catch (error) {
        console.dir(error);
      }
    };

    getError();
  }, []);

  return (
    <div>
      <h1>APP</h1>
    </div>
  );
}

export default App;
