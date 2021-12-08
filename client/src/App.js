import axios from "axios";
import { useEffect } from "react";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

function App() {
  useEffect(() => {
    const getData = async () => {
      try {
        const rest = await axios({
          method: "post",
          url: "http://localhost:5000/api/register",
          data: {
            email: "jaroszw@gmail.com",
            name: "Vandal",
            password: "123456",
          },
          "Content-Type": "application/json",
        });
        console.log(rest);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return <div className="App">App</div>;
}

export default App;
